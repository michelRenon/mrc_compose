

/*

test unit for mrcSplitEmailList()

*/




    function _splitEmailList_js_version (data, separator, quote, escaper) {
        /*
         * Split a list of complete emails, separated by commas (default).
         * 
         * each complete email can have two parts :
         * [diplayName] <email>
         * displayName is optionnal
         * 
         * displayName can contains specials characters :
         * if it contains ',', displayName is quoted
         * if it contains quote, the quote is backslashed
         * if it contains a backslash, it is backslashed
         * 
         * ex :
         *   John DOE <john.doe@isp.com>
         *   "DOE, John" <john.doe@isp.com>
         *   "DOE, John (\"Jojo\")" <john.doe@isp.com>
         *   "DOE, John \\/" <john.doe@isp.com>
         * 
         * params :
         *   data : text, the list of emails
         *   separator : (optional) default is comma
         *   quote : (optional) default is quote
         *   escaper : (optional) default is backslash
         *
         * returns :
         *    array of emails, still quoted and backslashed
         */
        
        if (!separator) var separator = ',';
        if (!quote) var quote = '"';
        if (!escaper) var escaper = '\\';
        // separator and escaper MUST BE 1 char length

        var output = [];
        var nbData = data.length;
        var inQuote = false;
        var curChar = '';
        var part = '';
        var doPushPart = false;
        var doPushChar = true;
        var doEscapeNextChar = false;
        
        // we parse the data, iterate over each character
        for(var i=0 ; i<nbData ; i++) {
            curChar = data[i];
            doPushPart = false;
            doPushChar = true;
            
            if (doEscapeNextChar === false) {
                // previous char was NOT an 'escaper'
                // we make std process
                
                // quote handling
                if (curChar === quote)
                    inQuote = ! inQuote;
                // separator handling
                if (inQuote === false) {
                    if (curChar === separator) {
                        doPushPart = true;
                        doPushChar = false;
                    }
                }
                // escaper handling
                if (curChar === escaper) {
                    // escape next char
                    doPushChar = false;
                    doEscapeNextChar = true;
                }
            } else {
                // previous char was an 'escaper'
                // no tests : we insert that car directly
                doPushChar = true; //  ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BAD VARIABLE : NEED TO RETEST 
                doEscapeNextChar = false;
            }
      
            // now execute actions for current char
            if (doPushChar) {
                part += curChar;
            }
            if (doPushPart) {        
                output.push(part);
                part = '';
            }
        }
        
        // always a value
        output.push(part);
        return output;
    }

  

// =================================



var val1 = '"RENON, Michel (\'elMaco\')" <michel.renon@free.fr>,"RENON, Michel (elMaco)" <michel.renon@free.fr>,"GURRET, Joel (AEROLIA SAS)" <Joel.GURRET@aerolia.com>,\'chris abo\' <santalaria@hotmail.fr>, "michel.renon@free.fr" <michel.renon@free.fr>';
// var val1 = '"RENON\\"s, Michel (\\"el,Maco\\")" <michel.renon@free.fr>';
// var val1 = '"RENON, Michel (\'elMaco\') <michel.renon@free.fr>","RENON, Michel (elMaco)" <michel.renon@free.fr>,"GURRET, Joel (AEROLIA SAS) <Joel.GURRET@aerolia.com>",\'chris abo\' <santalaria@hotmail.fr>, "michel.renon@free.fr <michel.renon@free.fr>"';


// var val1 = '"RENON<mic>, \\\\/ Michel (\\"el,Maco\\")" <michel.renon@free.fr>'





// test des valeurs speciales
var valeurs = [
    { 'src' : '',
      'res' : [''] },

    { 'src' : 'aaaa',
      'res' : ['aaaa'] },

    { 'src' : ',',
      'res' : ['', ''] },

    { 'src' : ',,,',
      'res' : ['', '', '', ''] },

    { 'src' : 'a,b,c,d',
      'res' : ['a', 'b', 'c', 'd'] },


    { 'src' : '"RENON, Michel (elMaco)" <michel.renon@free.fr',
      'res' : ['"RENON, Michel (elMaco)" <michel.renon@free.fr'] },

    { 'src' : '"RENON, Michel (\'elMaco\')" <michel.renon@free.fr>',
      'res' : ['"RENON, Michel (\'elMaco\')" <michel.renon@free.fr>'] },

    { 'src' : '"RENON<mic>, \\\\/ Michel (\\"el,Maco\\")" <michel.renon@free.fr>',
      'res' : ['"RENON<mic>, \\/ Michel ("el,Maco")" <michel.renon@free.fr>'] },


    { 'src' : '"RENON, Michel (elMaco)" <michel.renon@free.fr,"RENON, Michel (\'elMaco\')" <michel.renon@free.fr>,"RENON<mic>, \\\\/ Michel (\\"el,Maco\\")" <michel.renon@free.fr>',
      'res' : ['"RENON, Michel (elMaco)" <michel.renon@free.fr', '"RENON, Michel (\'elMaco\')" <michel.renon@free.fr>','"RENON<mic>, \\/ Michel ("el,Maco")" <michel.renon@free.fr>'] },

];


function _myEncode(txt) {
    /* 
     * utility to encode text
     * 
     * params :
     *   txt : the text to encode
     * return
     *   the text encoded
     */
    // default : we make essentials encoding : replace cars that break html
    txt = txt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); 

    // return encodeURI(txt);
    // TODO : use the correct API to encode texts

    return txt;
}

function compareArray(a1, a2)
{
    if (a1.length != a2.length) {
        return false;
    } else {
        for (var a = 0; a < a1.length; ++a) {
            if (a1[a] != a2[a]) {
                return false;
            }
        }
    }
    return true;
}


document.write("<h1>TEST DES VALEURS</h1>");

var nb = valeurs.length;
var src = '';
var res = '';
var ret = null;
for (var i=0 ; i < nb ; i++) {
    src = valeurs[i]['src'];
    res = valeurs[i]['res'];
    ret = _splitEmailList_js_version(src);
    if (compareArray(res, ret)) {
        // ok
        document.write("OK&nbsp;&nbsp;'"+_myEncode(src)+"'<br>");
    } else {
        // KO
        document.write("KO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'"+_myEncode(src)+"'<br>");
        document.write(res.toString()+"<br>");
        document.write(ret.toString()+"<br>");
        document.write("-------------------<br>");

    }
}







// ===============================================
if (false) {
document.write("<h1>TEST DES PERFORMANCES</h1>");
var startTime;
var endTime;
var nb = 200;
var nbs = [20, 200, 2000, 20000, 100000, 200000];
for (var i = 0 ; i < nbs.length ; i++) {
    nb = nbs[i];
    src = '';
    res = [];
    for(var j=0 ; j<nb ; j++) {
        src += "\"DOE"+j+", John\" <john.doe"+j+"@isp.com>";
        if (j < nb-1) src += ",";
        res.push("\"DOE"+j+", John\" <john.doe"+j+"@isp.com>");
    }

    startTime = new Date().getTime();
    ret = mrcSplitEmailList(src);
    endTime = new Date().getTime();

    if (compareArray(res, ret)) {
        document.write(nb+" emails : "+(endTime-startTime)+"<br>");
    } else {
        document.write(nb+" emails : "+(endTime-startTime)+"  KO<br>");
    }

}
// test performances : OK !
// 100000 emails --> 1.1s
// 20000 emails --> 0.2s
// 2000 emails --> 0.02s
// 200 emails --> 0.004s
// 20 emails --> 0.002s


//20 emails : 0
//200 emails : 0
//2000 emails : 3
//20000 emails : 32
//100000 emails : 181
//200000 emails : 346
}
