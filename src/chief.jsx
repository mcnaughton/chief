if($ === undefined) {
    $={};
}

$._chief = (function () {
    'use strict';

    var ext = {};

    ext.appendText = function (msg, id, slug, op) {
        var myTextFile;
        try {
            myTextFile = new File(id + "-" + slug + ".txt");
            myTextFile.open(op);
            myTextFile.writeln(msg);
            myTextFile.close();
        } catch (myError) {
            alert('Exception 7: ' + myError);
        }
    };

    ext.placeText = function (id, slug) {
        var myDocument,
            mySelection,
            myTextframe,
            myTextFile,
            myPage;

        try {

            try {
                myDocument = app.activeDocument;
            } catch (myError) {
                myDocument = app.documents.add();
            }

            try {
                if (app.properties.activeWindow) {
                    myPage = app.activeWindow.activePage;
                } else {
                    myPage = myDocument.pages.add();
                }
            } catch (myError) {
                myPage = myDocument.pages.add();
            }

            /*
             try {
             myTextFrame = myPage.textFrames.item(0);
             if (undefined == myTextFrame || null == myTextFrame) {
             myTextFrame = myPage.textFrames.add({geometricBounds:[72, 72, 144, 144]})
             }
             } catch (myError) {
             myTextFrame = myPage.textFrames.add();
             }
             */
            /* appends `msg` to selected textbox */
            /*
             try {
             app.selection[0].texts[0].parentStory.insertionPoints.item(-1).contents = msg;
             } catch (myError) {
             alert('Exception 5: ' + myError);
             }*/

            /* places text in selected textbox */
            try {
                app.selection[0].texts[0].parentStory.insertionPoints.item(-1).place(File(id + "-" + slug + ".txt"));
            } catch (myError) {
                alert('Exception 6: ' + myError);
            }

        } catch (myError) {
            alert(myError);
        }
    };

    //Evaluate a file and catch the exception.
    ext.evalFile = function (path) {
        try {
            $.evalFile(path);
        } catch (e) {
            alert("Exception:" + e);
        }
    };

    // Evaluate all the files in the given folder
    ext.evalFiles = function (jsxFolderPath) {
        var folder = new Folder(jsxFolderPath);
        if (folder.exists) {
            var jsxFiles = folder.getFiles("*.jsx");
            var i;
            for (i = 0; i < jsxFiles.length; i++) {
                var jsxFile = jsxFiles[i];
                $._ext.evalFile(jsxFile);
            }
        }
    };

    return ext;

}());