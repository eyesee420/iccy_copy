'use strict';

/**
 * @namespace Custom_Page
 */

var server = require('server');
var cache = require('app_storefront_base/cartridge/scripts/middleware/cache');
var consentTracking = require('app_storefront_base/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('app_storefront_base/cartridge/scripts/middleware/pageMetaData');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Custom_Page-Show
 * @function
 * @memberof Custom_Page
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('app_storefront_base/cartridge/scripts/helpers/pageMetaHelper');
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
    res.render('custom_object/subscribePage');

    var Transaction = require('dw/system/Transaction');
    //var subscribe = req.querystring.subscribe;
    // var subscriber = dw.object.CustomObjectMgr.getAllCustomObjects("Subscribe");
    // var subscribers = subscriber.asList();
    if(req.querystring.subscribe){
    Transaction.wrap(function () {
        var subscribe = req.querystring.email;
        var email = "asdsadsa";
        var fname = req.querystring.full_name;

        var subs = dw.object.CustomObjectMgr.createCustomObject("Subscribe",subscribe);
        subs.custom.subscribe = subscribe;
        subs.custom.email = email;
        subs.custom.full_name = fname;

    });

    }


    next();
}, pageMetaData.computedPageMetaData);


server.get('ErrorNotFound', function (req, res, next) {
    res.setStatusCode(404);
    res.render('error/notFound');
    next();
    
});

module.exports = server.exports();
