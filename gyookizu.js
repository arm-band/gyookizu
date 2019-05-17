(function($) {
    $.fn.gyookizu = function(options) {
        /* *************************
         * default                 *
         * *********************** */
        var defaultLLW = {
            lat: 35.039206,
            lng: 135.773007,
            win: '<div id="gyookizu">賀茂御祖神社</div>'
        };
        var defaults = {
            mapid    : 'map',
            latlngws : defaultLLW,
            openwin  : true,
            opts     : {
                zoom: 15,
                scrollwheel: false
            }
        };
        var defaultsOrigin = JSON.parse(JSON.stringify(defaults)); //copy
        /* *************************
         * set params              *
         * *********************** */
        var params = $.extend(defaults, options);
        /* *************************
         * function                *
         * *********************** */
        //general
        var isObject = function(obj) {
            return (obj instanceof Object && !(obj instanceof Array)) ? true : false;
        }
        var hashLength = function(array){
            var length = 0;
            for(var key in array) {
                length++;
            }
            return length;
        }
        var escHtml = function(html) {
            return html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
        }
        //error message
        var errMsg = function(num) {
            var msgTmpl = {
                null: 'が指定されていません。',
                empty: 'が空欄です。',
                invalid: 'が不正です。'
            };
            var msg = {
                0:  '予期しないエラーです。',
                1:  '地図を表示できませんでした。',
                10: 'マップ用のHTMLタグのID' + msgTmpl.null,
                11: 'マップ用のHTMLタグのID' + msgTmpl.invalid,
                12: 'マップ用のHTMLタグのID' + msgTmpl.empty,
                20: '経緯と吹き出し用の引数' + msgTmpl.null,
                21: '経緯と吹き出し用の引数' + msgTmpl.invalid,
                31: '中央位置' + msgTmpl.invalid,
                32: '中央位置は経緯と吹き出し用の引数の個数より小さな値で指定してください。',
                41: '情報ウインドウ開閉フラグ' + msgTmpl.invalid
            };
            return msg[num];
        }
        var mapErr = function(params, ErrMsg) {
            var $p = $('<p></p>');
            $p.text(ErrMsg(1));
            $('#' + params.mapid).append($p);
        }
        //parameter check
        var checkMapID = function(params, errMsg) {
            if (typeof params.mapid == 'undefined' || typeof params.mapid == 'null') {
                console.log(errMsg(10));
                return false;
            }
            else if (typeof params.mapid !== 'string') {
                console.log(errMsg(11));
                return false;
            }
            else if (params.mapid.length <= 0) {
                console.log(errMsg(12));
                return false;
            }
            return true;
        }
        var checkInLLW = function(lat, lng, win) {
            if (
                typeof lat == 'undefined' ||
                typeof lng == 'undefined' ||
                typeof win == 'undefined' ||
                typeof lat == 'null' ||
                typeof lng == 'null' ||
                typeof win == 'null'
            ) {
                return 21;
            }
            else if (
                lat < 0 || 180 < lat ||
                lng < 0 || 180 < lng
            ) {
                return 22;
            }
            return -1;
        }
        var checkLatlngws = function(params, errMsg, isObject) {
            if (typeof params.latlngws == 'undefined' || typeof params.latlngws == 'null') {
                console.log(errMsg(20));
                return false;
            }
            else if (typeof params.latlngws !== 'object') {
                console.log(errMsg(21));
                return false;
            }
            else {
                if(isObject(params.latlngws)) {
                    var msgNum = checkInLLW(params.latlngws.lat, params.latlngws.lng, params.latlngws.win);
                    if(msgNum >= 0) {
                        console.log(errMsg(msgNum));
                        return false;
                    }
                }
                else {
                    if(hashLength(params.latlngws) > 0) {
                        for(var key in params.latlngws) {
                            var msgNum = checkInLLW(params.latlngws[key].lat, params.latlngws[key].lng, params.latlngws[key].win);
                            if(msgNum >= 0) {
                                console.log(errMsg(msgNum));
                                return false;
                            }
                        }
                    }
                    else {
                        console.log(errMsg(21));
                        return false;
                    }
                }
            }
            return true;
        }
        var checkOpenWin = function(params, errMsg) {
            if (typeof params.openwin == 'undefined' || typeof params.openwin == 'null') {
                params.openwin = defaults.openwin;
            }
            else if (typeof params.openwin !== 'boolean') {
                console.log(errMsg(41));
                return false;
            }
            return true;
        }
        var checkOpts = function(params, defaults) {
            if (typeof params.opts.zoom == 'undefined' || typeof params.opts.zoom == 'null') {
                params.opts.zoom = defaults.opts.zoom;
            }
            if (typeof params.opts.scrollwheel == 'undefined' || typeof params.opts.scrollwheel == 'null') {
                params.opts.scrollwheel = defaults.opts.scrollwheel;
            }
            return true;
        }
        //marker
        var tokko = function(map, gLatLng, win, infowindow, escHtml) {
            var marker = new google.maps.Marker({
                position : gLatLng,
                map : map,
//                icon: arrowIcon,
                title : escHtml(win)
            });
            google.maps.event.addListener(marker, 'click', function() {
                keiranshuyoshu(map, marker, infowindow, win);
                //centering
                map.panTo(gLatLng);
            });
            return marker;
        }
        //information window
        var keiranshuyoshu = function(map, marker, infowindow, win) { //常什物帳
            infowindow.setContent(win);
            infowindow.open(map, marker);
        }
        //initialize & process
        var gyooki = function(params, isObject, escHtml) {
            var mapElm = document.getElementById(params.mapid);
            //setting of map id
            var map = new google.maps.Map(mapElm, params.opts);
            var bounds = new google.maps.LatLngBounds();
            var infowindow = new google.maps.InfoWindow();
            if(isObject(params.latlngws)) {
                var gLatLng = new google.maps.LatLng(params.latlngws.lat, params.latlngws.lng);
                bounds.extend(gLatLng);
                var marker = tokko(map, gLatLng, params.latlngws.win, infowindow, escHtml);
                //default open information window
                if(params.openwin) {
                    keiranshuyoshu(map, marker, infowindow, params.latlngws.win);
                }
                //centering
                map.panTo(gLatLng);
            }
            else {
                if(hashLength(params.latlngws) > 0) {
                    //loop of markers
                    for(var key in params.latlngws) {
                        var gLatLng = new google.maps.LatLng(params.latlngws[key].lat, params.latlngws[key].lng)
                        bounds.extend(gLatLng);
                        var marker = tokko(map, gLatLng, params.latlngws[key].win, infowindow, escHtml);
                    }
                    //fit bounds
                    map.fitBounds(bounds);
                }
                else {
                    mapErr(params, ErrMsg);
                }
            }
        }
        /* *************************
         * main process            *
         * *********************** */
        window.addEventListener('load', function() {
            if(checkMapID(params, errMsg) &&
            checkLatlngws(params, errMsg, isObject) &&
            checkOpenWin(params, errMsg) &&
            checkOpts(params, defaultsOrigin)) {
                google.maps.event.addDomListener(window, 'load', gyooki(params, isObject, escHtml));
            }
        });
    }
})(jQuery);