(function (window) {
    var loadInfo = [
        {
            //加载启动文件
            "resName": "load",
            "type": "",
            "Resres": [
                {
                    "resUrl": "res/fui/load.txt"
                },
                {
                    "resUrl": "res/fui/load_atlas0.png"
                }
            ]
        },
        {
            //主UI
            "resName": "main",
            "type": "ui",
            "Resres": [
                {
                    "resUrl": "res/fui/main.txt"
                }
            ]
        },
        {
            "resName": "u3dObj",
            "type": "u3d",
            "Resres": [
                {
                    "resUrl": "res/u3d/main/Conventional/2.ls",
                    //"resUrl": "res/u3d/main/Conventional/test.ls"
                }
            ]
        }
    ]
    window["loadInfo"] = loadInfo;
})(window)