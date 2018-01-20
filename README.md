# WebScraperUsingNodeJs

This project implements a webscraper using Node Js. The project makes use of especially cheerio and Google web scraper npm modules along with xlsx and request.

It reads the data from an excel and scrapes the given site in excel for the given search terms. Make sure that the first row first column contains the search term and the second column contains the search site. This is compulsory because, the code follows this pattern.

The search attributes for which the values are required should be placed next to the search site. The attributes can be of any length. The results obtained after parsing are written to a file.

Code Flow:
1. Read the Excel
2. Send the search string and search site to the Google web scraper
3. Process each URL returned by Google for a title match
4. If match is found, then fetch the page contents and search for the attribute values
5. Write the results to a file

