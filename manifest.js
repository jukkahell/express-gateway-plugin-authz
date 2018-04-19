// @ts-check
/// <reference path="./node-modules/express-gateway/index.d.ts" />

/** @type {ExpressGateway.Plugin} */
const plugin = {
    version: '1.0.0',
    policies: ['authz'],
    init: function(pluginContext) {
        console.log(pluginContext);
        pluginContext.registerPolicy({
            name: 'authz',
            schema: {
                $id: 'http://express-gateway.io/schemas/policies/authz.json',
                type: 'object',
                properties: {
                    loginUrl: {
                        type: 'string',
                        format: 'url',
                        description: 'User will be redirected to this login url if header/session is not found'
                    },
                    authKeyName: {
                        type: 'string',
                        description: 'Key name to search for auth header/session'
                    }
                }, required: ['loginUrl', 'authKeyName']
            },
            policy: (actionParams) => {
                return (req, res, next) => {
                    if (!req.header(actionParams.authKeyName)) {
                        if (!req.session[actionParams.authKeyName]) {
                            console.log("Session not found, redirecting to login url:", actionParams.loginUrl);
                            res.redirect(actionParams.loginUrl);
                            return;
                        }
                    } else {
                        req.session[actionParams.authKeyName] = req.header(actionParams.authKeyName);
                    }
                    next();
                };
            }
        });
    }
};

module.exports = plugin;
