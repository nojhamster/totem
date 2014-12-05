/**
 * Created by matthias on 02/12/14.
 * Loader get Keywords from path Options by admin
 * Then inserts them in input.keywords
 */

var objectPath = require('object-path');

'use strict';
module.exports = function(options) {
    options = options || {};
    return function (input, submit) {

        // Direct XML Path WITh dot notation for silence & eval
        var keywordsSilencePath = "content.json." + options.keywordsSilencePath,
            keywordsEvalPath = "content.json." + options.keywordsEvalPath;


        /*
         * getContent() get content of path in input
         * input (obj)
         * path (string )
         */
        var getContent = function(path , method , callCount ,  callinsert){

            var filter,
                pathToinsert,
                content;

            if(method == 'silence'){
                filter = function (content) {
                    return (((content.scheme == "inist-francis" ) ||  (content.scheme == "inist-pascal" )) && ((content['xml#lang'] == "fr" )));
                };
                pathToinsert = "keywords.silence";
            }

            else if (method == 'eval'){
                filter = function (content) {
                    return ((content.scheme !== "inist-francis" ) &&  (content.scheme !== "inist-pascal" ) && (content.scheme !== "cc" ) && (content.scheme !== "author" ) && (content['xml#lang'] == "fr" ) );
                };
                pathToinsert = "keywords.eval";
            }

            content = objectPath.get(input ,path).filter(filter);


            if(callCount){
                content = callCount(content , "term");
                callinsert(pathToinsert ,content)
            }
            else{
                callinsert(pathToinsert ,content)
            }

        };


        /*
         * countKeywords() count nb of Keywords in an object
         * Then inserts the value in object.length
         * arr (array)
         * keywordsPath (string)
         */
        var countKeywords = function(arr , keywordsPath){
                for( i = 0 ; i < arr.length ; i++) {
                    arr[i].size = (objectPath.get(arr[i] ,keywordsPath)).length;
                }
                return arr;
        };



        /*
         * insertKeywords() add content in input
         * input (obj)
         * path (string )
         * content (obj , string , array or number)
         */
        var insertKeywords = function(path , content){

            objectPath.ensureExists(input , path , content);

        };


        getContent(keywordsSilencePath , 'silence' , countKeywords , insertKeywords);
        getContent(keywordsEvalPath , 'eval'    , countKeywords , insertKeywords);


        submit(null, input);

    }

};