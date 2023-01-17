/* இந்த கையெழுத்துப்படிவம் ஒரு உள்ளூர் முன்-உறுதிமொழி கொக்கி கையெழுத்துப்படிவம் ஆகும்.
 * மாற்றியமைக்கப்பட்ட கோப்புகளின் பதிப்புரிமை ஆண்டு நடப்பு ஆண்டு வரை 
 * அதிகரிக்கப்பட்டுள்ளதா என்பதைச் சரிபார்க்க இது பயன்படுகிறது.
 *
 * *.c, *.cpp, *.h, *.idl மற்றும் *.pot கோப்புகள் மட்டுமே சரிபார்க்கப்படுகின்றன
 *
 * இது போன்ற உள்ளூர் கொக்கி கையெழுத்துப்படிவங்களை அமைக்கவும் (முன்-உறுதிமொழி கொக்கி):
 * WScript இந்த/கையெழுத்துப்படிவ/கோப்பிற்கான/பாதை.js
 * மற்றும் "கையெழுத்துப்படிவம் முடிவடையும் வரை காத்திரு" என்பதை அமைக்கவும்
 */

var ForReading = 1;
var objArgs, num;

objArgs = WScript.Arguments;
num = objArgs.length;
if (num !== 3)
{
    WScript.Echo("Usage: [CScript | WScript] checkyear.js path/to/pathsfile path/to/messagefile path/to/CWD");
    WScript.Quit(1);
}

var currentyear = new Date().getFullYear();
var re = new RegExp('^(\\\/\\\/|#) Copyright.+(' + currentyear + ')(.*)');
var basere = /^(\/\/|#) Copyright(.*)/;
var filere = /(\.c$)|(\.cpp$)|(\.h$)|(\.idl$)|(\.pot$)/;
var found = true;
var fs, a, rv, r;
fs = new ActiveXObject("Scripting.FileSystemObject");
// remove the quotes
var files = readPaths(objArgs(0));
// going backwards with while is believed to be faster
var fileindex = files.length;
var errormsg = "";

while (fileindex--)
{
    var f = files[fileindex];
    if (f.match(filere) !== null)
    {
        if (fs.FileExists(f))
        {
            a = fs.OpenTextFile(f, ForReading, false);
            var copyrightFound = false;
            var yearFound = false;
            while ((!a.AtEndOfStream) && (!yearFound))
            {
                r = a.ReadLine();
                rv = r.match(basere);
                if (rv !== null)
                {
                    rv = r.match(re);
                    if (rv !== null)
                    {
                        yearFound = true;
                    }

                    copyrightFound = true;
                }
            }
            a.Close();

            if (copyrightFound && (!yearFound))
            {
                if (errormsg !== "")
                {
                    errormsg += "\n";
                }
                errormsg += f;
                found = false;
            }
        }
    }
}

if (found === false)
{
    errormsg = "the file(s):\n" + errormsg + "\nhave not the correct copyright year!";
    WScript.stderr.writeLine(errormsg);
}

WScript.Quit(!found);


// readFileLines
function readPaths(path)
{
    var retPaths = [];
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    if (fs.FileExists(path))
    {
        var a = fs.OpenTextFile(path, ForReading);
        while (!a.AtEndOfStream)
        {
            var line = a.ReadLine();
            retPaths.push(line);
        }
        a.Close();
    }
    return retPaths;
}
