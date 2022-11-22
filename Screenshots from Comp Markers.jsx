var exportScreenshotsUI = this;
var expScreenshotsUI = (function () {

    var expScreenshotsUI = (exportScreenshotsUI instanceof Panel) ? exportScreenshotsUI : new Window("palette");
    if (!(exportScreenshotsUI instanceof Panel)) expScreenshotsUI.text = "Screenshots from Markers";
        expScreenshotsUI.orientation = "column";
        expScreenshotsUI.alignChildren = ["center", "top"];
        expScreenshotsUI.spacing = 10;
        expScreenshotsUI.margins = 10;

    var folderBtn_imgString = "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%19%00%00%00%15%08%06%00%00%00%C2%B3%2BE%18%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%C2%9A%C2%9C%18%00%00%00%01sRGB%00%C2%AE%C3%8E%1C%C3%A9%00%00%00%04gAMA%00%00%C2%B1%C2%8F%0B%C3%BCa%05%00%00%01%0EIDATx%01%C3%AD%C2%95%C3%9Fm%C3%820%10%C2%87%7F%C3%A7%C2%BA%C2%A8%C2%82%3Ex%C2%84%C2%8C%C3%90%11%C3%A8%06%C3%9D%C2%A0%1D%C2%A1%3CVJ%C2%A5T%C2%80%C3%BAH%3B%01l%00%1B%C3%80%08l%406%C3%80%12%02%24%C3%BE%1Dg%20!%0F%08%C2%A4%C3%A0%C2%BC%20%C2%BE%17%3B%17%C3%8B%C2%9F%C3%A2%C2%8B%C3%AF%C3%88Dl%16%C2%8Fh%C2%81%C3%B1%06%C3%80%20%03%01C%C3%85%C3%B8%C2%99%7CS%0FW%40%C3%A5%26%C2%B7E%C3%B0q~%15%C2%A2%C3%92%12%C3%BF6%22%C2%8B%5C%C2%92%06%C2%8Fe4%0C%C3%94%C3%A6!%C3%BD%25%2F%C2%9E~9P%C2%9B%C3%B4%0Bs%C3%AC%C2%8C%C2%98%18%C2%BDiH5'a%17%C2%9B%C2%85D%C2%A7%C3%96%C2%96%C3%AB%1CA%C3%A1%5Dd%01%C3%B2%20%C3%87%7DQ%C2%92%C2%97J%C2%83%3Fe%C3%A3%C2%96L%C2%ADBAL%C2%8FGot%12%C2%94%1F%60%04%C3%9F%C3%B0~%C3%90%C2%99%40%C2%80%C2%82H%25%C2%BEs%C3%A2H%C3%B2%5DXN%C2%B2%C3%9C%25w%C3%89%0DHv%3D%C3%A2%C2%B9%C3%8EUx%C2%A4%C3%92%C3%A4%C2%97%C3%83%C3%94%C2%92T%C3%8B%C2%BE%5C%C3%8B%C2%AA%7B%C2%92%2B%3F%C2%80%1F%5C%7F%C3%9AI%C2%A4%C2%8Et%C3%885%C2%A7%C2%875%C2%BAI%C3%90%2B%C3%92%C2%B8J%0A%C2%AFi%C2%BDr2%C2%BD%C3%B2W%24%C2%B5Fl%C2%BF(v%C3%B3-%0A%C3%99S%C2%9FQ_%C2%A7%C2%97%00%00%00%00IEND%C2%AEB%60%C2%82";

    var OS = ($.os.indexOf('Windows') == -1) ? 'macos' : 'windows';
    var slash = (OS == 'windows') ? '\\' : '/';
    var scriptsProps = {
        'folder': Folder.desktop
    };

    var group1 = expScreenshotsUI.add('group {orientation : "row", alignChildren : ["left", "center"], spacing : 10, margins : 0, alignment : ["fill", "top"]}');

    var folderBtn = group1.add("iconbutton", undefined, File.decode(folderBtn_imgString), {style: "toolbutton" });

        // using mousedown because onClick doesn't work with iconbutton

        folderBtn.addEventListener('mousedown', function () {
            var folder = Folder.selectDialog("Select folder for screenshots");
            if (folder) scriptsProps.folder = folder;
            folderPath.text = scriptsProps.folder.fsName;
        });

    var folderPath = group1.add("statictext", [0, 0, 150, 25], scriptsProps.folder.fsName);

    var divider1 = expScreenshotsUI.add("panel", undefined, undefined);
        divider1.alignment = "fill";

    var exportScreenshotsBtn = expScreenshotsUI.add("button", undefined, "Export Screenshots");
        exportScreenshotsBtn.alignment = ["fill", "top"];

        exportScreenshotsBtn.onClick = function () {
            exportScreenshotsFromMarkers();
        };

    function exportScreenshotsFromMarkers() {

        exportInfo.text = "Exporting screenshots...";

        try {

            var comp = app.project.activeItem,
                pngFile = null,
                markers,
                currentFrame;

            if (comp == null || (!(comp instanceof CompItem))) return !!alert("No active comp");
            if (comp.markerProperty.numKeys == 0) return !!alert("No markers in active comp: " + comp.name);

            exportInfo.text = "Exporting screenshots from comp " + comp.name + "...";

            markers = comp.markerProperty;

            // loof through markers

            for (var k = comp.markerProperty.numKeys; k > 0; k--) {

                // convert current time to frame

                currentFrame = markers.keyTime(k) / comp.frameDuration;

                exportInfo.text = "Exporting frame " + currentFrame + "...";

                pngFile = File(scriptsProps.folder.fsName + slash + Folder.decode(comp.name) + " " + currentFrame + ".png");
                if (pngFile.exists) pngFile.remove();

                renderPNG(comp, markers.keyTime(k), pngFile);

            }

            exportInfo.text = ("Exported " + comp.markerProperty.numKeys + " screenshots from \"" + comp.name + "\"");

        } catch (err) {
            alert("Error while export\n" + err + "\nAt line " + err.line);
            exportInfo.text = "Error occured while export";
        }
    };

    function renderPNG(comp, time, outputPngFile) {

        // save static preview

        var pngFile = comp.saveFrameToPng(time, outputPngFile);

        while (!pngFile._isReady) {
            $.sleep(100);
        }

        if (pngFile._hasException) alert("There was an error while generating preview: " + pngFile._exception);

        return true;

    };

    var divider2 = expScreenshotsUI.add("panel", undefined, undefined);
        divider2.alignment = "fill";

    var exportInfo = expScreenshotsUI.add("statictext", [0,0, 150, 25], "");
        exportInfo.alignment = ["fill","top"];


    expScreenshotsUI.layout.layout(true);
    expScreenshotsUI.layout.resize();
    expScreenshotsUI.onResizing = expScreenshotsUI.onResize = function () {
        this.layout.resize();
    }

    if (expScreenshotsUI instanceof Window) expScreenshotsUI.show();

    return expScreenshotsUI;

}());