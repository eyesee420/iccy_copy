'use strict';

/**
 * @namespace Custom_object
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
 * @name Base/Custom_object-Save
 * @function
 * @memberof Custom_object
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */



server.post('Save', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('app_storefront_base/cartridge/scripts/helpers/pageMetaHelper');
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
    // var page = PageMgr.getPage('homePage');
    
    var Transaction = require('dw/system/Transaction');

    if (req.form.email) {

        Transaction.wrap(function () {
            var email = req.form.email;
            var fname = req.form.first_name;
            var lname = req.form.last_name;
            var prof  = req.form.profession;

            var newObj = dw.object.CustomObjectMgr.createCustomObject("NewsletterSubscription", email);
           
            newObj.custom.first_name = fname;
            newObj.custom.last_name =  lname;
            newObj.custom.profession = prof;
        });
     res.render('custom_object/success');
     //res.render('custom_object/start_form');
 
    } else { 
      res.render('error/notFound');
    }
    
    next();
}, pageMetaData.computedPageMetaData);


server.get('Start', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('app_storefront_base/cartridge/scripts/helpers/pageMetaHelper');
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
    
    var  emails = dw.object.CustomObjectMgr.getAllCustomObjects("NewsletterSubscription");
    var  email_list = emails.asList();
    var test = email_list[1].custom;    

    var me = test.email;
   
    var Transaction = require('dw/system/Transaction');

        res.render('custom_object/start_form');

    next();
}, pageMetaData.computedPageMetaData);



server.get('Remove', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var PageMgr = require('dw/experience/PageMgr');
    var pageMetaHelper = require('app_storefront_base/cartridge/scripts/helpers/pageMetaHelper');
    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

    // var email = req.querystring.email;
    var email = 'jaime360@gmail.com';
    var form_email = dw.object.CustomObjectMgr.getCustomObject("NewsletterSubscription",email);
 

    var Transaction = require('dw/system/Transaction');

        Transaction.wrap(function () {
            res.render('error/notFound');

            dw.object.CustomObjectMgr.remove(form_email);
            res.render('custom_object/delete');
    });

    
    next(); 
}, pageMetaData.computedPageMetaData);


server.get('ErrorNotFound', function (req, res, next) {
    res.setStatusCode(404);
    res.render('error/notFound');
    next();
    
});

module.exports = server.exports();
