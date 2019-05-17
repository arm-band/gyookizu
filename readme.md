# Gyookizu

## Abstract

Google Maps APIを簡単に利用できるようにするjQueryプラグイン

## Usage

1. Githubのリポジトリからzipをダウンロード
2. zipを解凍し、`gyookizu.js`をプロジェクトのJSディレクトリにコピー
3. `gyookizu.js`を読み込むようにHTMLに記述(例: <script src="./js/gyookizu.js"></script>)
4. `gyookizu.js`を読み込んだ後のJavaScript内に下記コードを記述します
    - 各パラメータは各自調整してください

~~~javascript
$('body').gyookizu({
    mapid    : 'map',
    latlngws : {
        lat: 35.039206,
        lng: 135.773007,
        win: '<div id="gyookizu">賀茂御祖神社</div>'
    },
    opts     : {
        zoom: 15,
        scrollwheel: false
    }
});
~~~

※`gyookizu.js`を読み込む前にjQueryを読み込んでください

## Opstions

プラグインを呼び出す際の引数は以下の通り(引数順番通り)。

| 引数名   |     型 | デフォルト値 | 説明 |
|---------:|-------:|-------------:|:---|
| mapID    | String | `map`        | マップを表示するHTMLタグのIDを指定してください。 |
| latlngws | Associative array(depth 1) or Array(depth: 2) | `{ lat: float, lng: float, win: string(allowed html) }` | `{ lat: float, lng: float, win: string }`のような連想配列ならばマップにピンが1つ、深さ2の配列(`[{ lat: float, lng: float, win: string }, { lat: float, lng: float, win: string }]`のような形)の場合は配列の要素数だけピンが配置されます。 |
| openwin  | boolean | `true` | 初期表示で情報ウインドウを開くかどうか(単一ピンの場合のみ有効) |
| opts     | Object | `{ zoom: 15, center: new google.maps.LatLng(latlngws.lat, latlngws.lng), scrollwheel: false }` | `opts`の内容はそのままGoogle Maps APIに投げるオプションパラメータになります。`center`のデフォルト値は上記パラメータのデフォルトの`latlngws`の緯度経度から生成されたGoogle Mapsのオブジェクトになります。 |

※ピンのアイコン画像を変更することには対応していません。

## Examples

### 複数ピンを設置する場合

~~~javascript
$('body').gyookizu({
    mapid: 'map',
    latlngws: [
        {
            lat: 34.707099,
            lng: 138.922825,
            win: '下田温泉'
        },
        {
            lat: 34.799250,
            lng: 135.246299,
            win: '<div><h4>有馬温泉駅</h4><p>有馬温泉</p></div>'
        },
        {
            lat: 34.807955, 
            lng: 137.257640,
            win: '<div>三谷温泉</div>'
        }
    ],
    center: 1
});
~~~

### マップの色を変更し、情報ウインドウを初期表示しない場合

~~~javascript
$('body').gyookizu({
    latlngws: {
        lat: 34.538168,
        lng: 135.474290,
        win: '<div>家原寺</div>'
    },
    openwin: false,
    opts: {
        styles: [{
            stylers: [
                { "hue": "#F66C02" },
                { "lightness": -10 },
                { "saturation": 10 }
            ],
            elementType: "all",
            featureType: "all"
        }]
    }
});
~~~