var XLSX = require('xlsx');
var cheerio = require('cheerio');
var fs = require('fs');
var URL = require('url');
var scraper = require('google-search-scraper');
var workbook = XLSX.readFileSync('web.xlsx');
var sheetName = workbook.SheetNames[0];
var processedCount = 0;
var arr = [];
var givenSites = [];
var $;
var sheet = workbook.Sheets[sheetName];
//result contains the first row present in the excel
   var result = [];
   var row;
   var rowNum;
   var colNum;
   var range = XLSX.utils.decode_range(sheet['!ref']);
   for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
      row = [];
       for(colNum=range.s.c; colNum<=range.e.c; colNum++){
          var nextCell = sheet[
             XLSX.utils.encode_cell({r: rowNum, c: colNum})
          ];
          if( typeof nextCell === 'undefined' ){
             row.push(void 0);
          } else row.push(nextCell.w);
       }
       result.push(row);
   }
if(result.length>0){
  //once the excel is read, the input of excel is passed to the google scraper to identify the urls present in the given site with the given search terms
  Googlescraper(result);
}
 
function Googlescraper(result){
var site = "site:";
var searchString = result[0][0]; 
//The first row first column in excel should be the search string
var searchSite = result[0][1];
//The first row second column in excel should be the search site
console.log("search site is "+searchSite);
var queryforGoogle = site.concat(searchSite).concat(" ").concat(searchString);
var options = {
  query: queryforGoogle,
  limit: 5
  //solver: dbc
};
scraper.search(options, function(err, url) {
  // This is called for each result
  if(err) throw err;
  else{
  console.log(url);
  //All the urls that google gives are pushed into the array arr.
  arr.push(url);
  }
  if(arr.length>0){
  //The urls obtained from google are processed to search for the given attributes
  ProcessURLS(arr);
}
});
}
 
 
function ProcessURLS(arr){
  for(var j=0;j<arr.length;j++){
    console.log("Array Length is"+arr.length);
    request(arr[j], function (error, response, body)
{
  if (!error && response.statusCode == 200)
  {
  console.log(arr[j]);
    $ = cheerio.load(body);
    $('script').remove();
    $('noscript').remove();
    var content = $.text();
    var data1 = content.replace(/\s\s+/g, ' ');
    var title = $("title").text().replace(/\s/g,'');
    console.log("the title is "+title);
    var finalTitle = result[0][0].replace(/\s/g,'');
    //Make sure that the scraper crawls the correct page by checking for the search term in the title of the page.
    var isTitleMatch = title.search(finalTitle);
        if(isTitleMatch != -1){
         getTheChildren();
       }
  }
 
});
  }
}
 
function getTheChildren(){
     for(var h=2;h<result[0].length && h!=null;h++){
       (function(h) {
      var value = result[0][h];
      //Please go through the site before hardcoding the tag below. THe default is given as tr -this may differ for various sites
      //Eg: If the content that you are looking for is present in paragraph tag, replace tr with p
    var h =  $("tr:contains('" + value + "')").children().text();
     if(h == "" && value){
      //If a given keyword doesn't match with that of original term present in site, the below logic forms various patterns to perform searches and get the result
     var inarr = value.split(" ");
     console.log("The value of inarr is "+inarr.length);
     if(inarr.length > 1){
      for(var f=0;f<inarr.length;f++){
         h = $("tr:contains('" + inarr[f] + "')").children().text();
         if(h != "")
          break;
      }
     }
   }
    var attribute = "The value of attibute"+value+" is "+h+"\n";
    //The results of scraper are written into a file resultsOfScraper
         fs.appendFile("resultsOfScraper.txt",attribute,function(err){
           if(err){
             console.log(err);
           }
         })
        })(h);
     }
}