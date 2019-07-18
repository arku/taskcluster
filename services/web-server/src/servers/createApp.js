const bodyParser = require('body-parser-graphql');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const playground = require('graphql-playground-middleware-express').default;
const passport = require('passport');
const url = require('url');
const AzureTablesStoreFactory = require('connect-azuretables')(session);
const credentials = require('./credentials');

module.exports = async ({ cfg, strategies }) => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', 'src/views');

  const allowedCORSOrigins = cfg.server.allowedCORSOrigins.map(o => {
    if (typeof(o) === 'string' && o.startsWith('/')) {
      return new RegExp(o.slice(1, o.length - 1));
    }
    if (o === 'https://taskcluster.net') {
      o = 'https://taskcluster-ui.herokuapp.com';
    }
    return o;
  }).filter(o => o);
  app.use(cors({origin: allowedCORSOrigins}));

  app.use(session({
    store: AzureTablesStoreFactory.create({
      table: cfg.azure.tableName,
      storageAccount: cfg.azure.accountId,
      accessKey: cfg.azure.accountKey,
      // Delete expired sessions every 1 hour
      sessionTimeOut: 60,
    }),
    secret: cfg.login.sessionSecret,
    sameSite: true,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      secure: url.parse(cfg.app.publicUrl).hostname !== 'localhost',
      httpOnly: true,
      // 1 week
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(credentials());
  app.use(compression());
  app.post(
    '/graphql',
    bodyParser.graphql({
      limit: '1mb',
    })
  );

  if (cfg.app.playground) {
    app.get(
      '/playground',
      playground({
        endpoint: '/graphql',
        subscriptionsEndpoint: '/subscription',
      })
    );
  }

  passport.serializeUser((user, done) => {
    const { identityProviderId, identity } = user;

    return done(null, {
      identityProviderId,
      identity,
    });
  });
  passport.deserializeUser(async (obj, done) => {
    return done(null, obj);
  });

  app.post('/login/logout', (req, res) => {
    // Remove the req.user property and clear the login session
    req.logout();
    res
      .status('200')
      .send();
  });

  Object.values(strategies).forEach(strategy => {
    strategy.useStrategy(app, cfg);
  });

  return app;
};
