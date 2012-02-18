(function() {
      var server_url = "{{server_url}}"

    if (window.location.href.match(/^http:\/\/.*?\.?clipepper\.com\//)) {
        alert('Pin button has been installed.');
        return false;
    }

    if (typeof window.pinmePanel == 'undefined') {
        window.pinmePanel = {};
    }

    if (window.pinmePanel.proceed) {
        window.pinmePanel.close();
        return false;
    }

    window.pinmePanel.proceed = true;

    function isIE() {
        return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
    }
    function isChrome() {
        return /Chrome/.test(navigator.userAgent);
    }
    function isSafari() {
        return /Safari/.test(navigator.userAgent) && !isChrome();
    }
    function isIOS() {
        return navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPhone/i) != null || navigator.userAgent.match(/iPod/i) != null || navigator.userAgent.match(/iPod/i) != null
    }
    function hasClass(elem, className) {
	    return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
	}
    function addClass(o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
        if (re.test(o.className)) return
        o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
    }

    function removeClass(o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
        o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
    }
    function in_array(needle, haystack, strict)
    {
        var found = false, key, strict = !!strict;

        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                found = true;
                break;
            }
        }

        return found;
    }

    function temphide(tag)
    {
        if (!window.pinmePanel.hiddenTag) {
            window.pinmePanel.hiddenTag = [];
        }

        var emb = document.getElementsByTagName(tag);

        for (var i = 0; i < emb.length; i++) {
            if (emb[i].style.display != 'none') {
                window.pinmePanel.hiddenTag.push([emb[i], emb[i].style.display]);
                emb[i].style.display = 'none';
            }
        }
    }

    function reverttemphide()
    {
        if (!window.pinmePanel.hiddenTag) {
            return;
        }

        for (var i = 0; i < window.pinmePanel.hiddenTag.length; i++) {
            window.pinmePanel.hiddenTag[i][0].style.display = window.pinmePanel.hiddenTag[i][1];
        }

        window.pinmePanel.hiddenTag = [];
    }

    function initPanel()
    {
        if (window.pinmePanel.panel) {
            window.pinmePanel.block.style.display = 'block';
            window.pinmePanel.panel.style.display = 'block';
            return;
        }

        window.pinmePanel.close = function()
        {
            window.pinmePanel.block.style.display = 'none';
            window.pinmePanel.panel.style.display = 'none';
            window.pinmePanel.imageContainer.innerHTML = '';
            window.pinmePanel.submitButton.style.display = 'none';
            reverttemphide();
            window.pinmePanel.proceed = false;
        }

        window.pinmePanel.select = function(item, imgId)
        {
            var img = window.pinmePanel.images[imgId];

            if (hasClass(item, 'selected')) {
                removeClass(item, 'selected');

                var selected = [];

                for (var i = 0; i < window.pinmePanel.selectedImages.length; i++) {
                    if (window.pinmePanel.selectedImages[i].id !== imgId) {
                        selected.push(window.pinmePanel.selectedImages[i]);
                    }
                }

                window.pinmePanel.selectedImages = selected;
            } else {
                addClass(item, 'selected');
                window.pinmePanel.selectedImages.push({id: imgId, src: img.src, alt: img.alt});
            }

            if (window.pinmePanel.selectedImages.length) {
                window.pinmePanel.submitButton.style.display = 'block';
            } else {
                window.pinmePanel.submitButton.style.display = 'none';
            }
        }

        window.pinmePanel.submit = function()
        {
            if (!window.pinmePanel.selectedImages.length) {
                return false;
            }

            var form = document.createElement('form');
            form.action = server_url + 'upload_selected_images/';
            form.method = 'POST';
            form.target = '_blank';

            form.innerHTML += '<input type="hidden" name="from_url" value="' + window.location.href + '" />';

            for (var i = 0; i < window.pinmePanel.selectedImages.length; i++) {
                form.innerHTML += '<input type="hidden" name="images_src_'+ i +'" value="' + window.pinmePanel.selectedImages[i].src + '" />';
                form.innerHTML += '<input type="hidden" name="images_alt_'+ i +'" value="' + window.pinmePanel.selectedImages[i].alt + '" />';
            }

            window.pinmePanel.panel.appendChild(form);

            form.submit();
            window.pinmePanel.close();
        }

        window.document.onkeydown = function (e)
        {
            if (!e) e = event;

            if (e.keyCode == 27) {
                window.pinmePanel.close();
            }
        }

        var css = [];

        css.push("div.pinmePanel {font-family: arial; font-size: 12px; color: #000; position: fixed; width: 100%; height: 100%; top: 0; left: 0; z-index: 100000002;}");
        css.push("div.pinmePanel a, div.pinmePanel a:hover {color: #000;}");
        css.push("div.pinmePanel div.pinmeHeader {width: 95%; margin: 5px auto; text-align: center;}");
        css.push("div.pinmePanel div.pinmeTitleHeader {font-size:16px; padding-top: 20px; text-align: center;}");
        css.push("div.pinmePanel div.pinmeClose {background: url('"+server_url+"img/face/gradient_top_btn.gif') repeat-x #fff; text-align: center; cursor: pointer; margin-bottom: 30px; font-size: 14px; padding-top:12px; height:28px; font-weight: bold; border-bottom: 1px solid #ccc;}");
        css.push("div.pinmePanel div.pinmeClose:hover {background: #55AA55; border-bottom: 1px solid #f47b20; color: #fff}");
        css.push("div.pinmePanel .pinmeImage {display: inline-block; cursor: pointer; position: relative; width: 120px; background: #ccc; height: 120px; overflow: hidden;margin:5px; border: 1px solid #000;}");
        css.push("div.pinmePanel .pinmeIcoVideo {background: url('"+server_url+"img/face/ico_video.png') no-repeat; width:26px;height:30px; position:absolute; z-index:2; right:3px;top:3px;}");
        css.push("div.pinmePanel .pinmeSelectButton {background: url('"+server_url+"img/face/button_select.png') no-repeat; width:71px;height:25px; position:absolute; z-index:3; left:25px;top:45px; display:none;}");
        css.push("div.pinmePanel .pinmeImage.selected .pinmeSelectButton {background: url('"+server_url+"img/face/button_deselect.png') no-repeat;}");
        css.push("div.pinmePanel .pinmeImage:hover .pinmeSelectButton {display:block;}");
        if (isChrome() || isSafari()) css.push("div.pinmePanel .pinmeImage {display: block; float: left;}");
        css.push("div.pinmePanel .pinmeImage.selected {border: 1px solid #f47b20;}");
        css.push("div.pinmePanel div.pinmeImageContainer {max-height: 50%; position: relative; background:#AAF; overflow: auto; text-align: center; width: 94%; margin: 0px auto; border: 1px solid #ccc; padding: 10px;}");
        css.push("div.pinmePanel .pinmeImage img {width: 120px; border: 0px;}");
        css.push("div.pinmePanel .pinmeImage div.pinmeInfo {width: 112px; font-size: 11px; padding: 4px; position: absolute; bottom: 0px; left: 0px; color: #000; text-align: center; background: #000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=40);-khtml-opacity: 0.4;opacity: 0.4;}");
        css.push("div.pinmePanel .pinmeImage.selected div.pinmeInfo {background: #f47b20;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=100);-khtml-opacity: 1;opacity: 1;}");
        css.push("div.pinmeBlock {position:fixed;width:100%;height:100%;z-index: 100000001;background:#000;top: 0; left: 0;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=70);-khtml-opacity: 0.7;opacity: 0.7;}");
        css.push("div.pinmePanel a.pinmeButton {display: none; color: #FFF; margin: 20px auto 0px; padding-top: 18px; font-size:16px; text-align: center; width: 293px; height: 38px; background: #22A url('"+server_url+"img/face/button_green.png') no-repeat;}");
        css.push("div.pinmePanel a.pinmeButton:hover {text-decoration: none;}");

        //ie fix
        if (isIE() && /\.(jpg|jpeg|gif|png)$/.test(window.location.href)) {
            css.push("div.pinmePanel, div.pinmeBlock {position: absolute;}");
            css.push("div.pinmePanel div.pinmeClose {height:40px;}");
            css.push("div.pinmePanel a.pinmeButton {height: 56px; margin-left:40%;}");
        }


        css = css.join("\n");

        window.pinmePanel.style = document.createElement("style");
        window.pinmePanel.style.type = "text/css";
        window.pinmePanel.style.media = "screen";

        if (isIE()) {
            window.pinmePanel.style.styleSheet.cssText = css;
            document.getElementsByTagName("head")[0].appendChild(window.pinmePanel.style)
        } else {
            if (navigator.userAgent.lastIndexOf("Safari/") > 0 && parseInt(navigator.userAgent.substr(navigator.userAgent.lastIndexOf("Safari/") + 7, 7)) < 533) {
                window.pinmePanel.style.innerText = css;
            } else {
                window.pinmePanel.style.innerHTML = css;
            }

            document.body.appendChild(window.pinmePanel.style)
        }

        window.pinmePanel.block = document.createElement('div');
        addClass(window.pinmePanel.block, 'pinmeBlock');
        document.body.appendChild(window.pinmePanel.block);

        window.pinmePanel.panel = document.createElement('div');
        addClass(window.pinmePanel.panel, 'pinmePanel');
        document.body.appendChild(window.pinmePanel.panel);

        window.pinmePanel.panel.innerHTML += '<div class="pinmeClose" onclick="window.pinmePanel.close()">Cancel</div>';
        window.pinmePanel.panel.innerHTML += '<div class="pinmeHeader"><a href="'+server_url+'" title="Pinme.ru" target="_blank"></a><div class="pinmeTitleHeader">Select pictures:</div></div>';

        window.pinmePanel.imageContainer = document.createElement('div');
        addClass(window.pinmePanel.imageContainer, 'pinmeImageContainer');
        window.pinmePanel.panel.appendChild(window.pinmePanel.imageContainer);

        window.pinmePanel.submitButton = document.createElement('a');
        window.pinmePanel.submitButton.href = '#';
        window.pinmePanel.submitButton.innerHTML = 'Pin selected &raquo;';
        addClass(window.pinmePanel.submitButton, 'pinmeButton');
        window.pinmePanel.submitButton.onclick = function()
        {
            window.pinmePanel.submit();
            return false;
        };
        window.pinmePanel.panel.appendChild(window.pinmePanel.submitButton);
    }

    var imagesSrc = [];
    var videoId = null;
    window.pinmePanel.images = [];
    window.pinmePanel.selectedImages = [];

    // Youtube (direct)
    if ((videoId = /^https?:\/\/(www\.)?youtube\.com\/watch.+v=([a-zA-Z0-9\-_]+)/.exec(window.location.href)) && (videoId=videoId[2]) && !in_array(videoId, imagesSrc)) {
        window.pinmePanel.images.push({isVideo: true, src: window.location.href, alt: document.title.replace(/\s+\-\s+YouTube$/, ''), thumb: 'http://img.youtube.com/vi/'+videoId+'/0.jpg', videoId: videoId});
        imagesSrc.push(videoId);
    }

    // Rutube (direct)
    if ((videoId = /^https?:\/\/(www\.)?rutube\.ru\/tracks\/([0-9]+)\.html/.exec(window.location.href))) {
        var links = document.getElementsByTagName('link');

        for (var i=0;i<links.length;i++) {
            if (links[i].rel="video_src") {
                videoId = links[i].href.split('/')[3];
                window.pinmePanel.images.push({isVideo: true, src: links[i].href, alt: document.title.split('::')[0], thumb: 'http://tub.rutube.ru/thumbs/'+videoId.substr(0,2)+'/'+videoId.substr(2,2)+'/'+videoId+'-2.jpg', videoId: videoId});
                imagesSrc.push(videoId);
                break;
            }
        }
    }

    // Images
    for (var i = 0; i < document.images.length; i++) {
        var image = document.images[i];

        if (image.width >= 150 && (typeof image.src != 'undefined') && !in_array(image.src, imagesSrc)) {
            window.pinmePanel.images.push(image);
            imagesSrc.push(image.src);
        }
    }

    // Youtube (iframe)
    var iframes = document.getElementsByTagName('iframe');

    for (var i = 0; i < iframes.length; i++) {
        if ((videoId = /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/.exec(iframes[i].src)) && (videoId=videoId[2]) && !in_array(videoId, imagesSrc)) {
            window.pinmePanel.images.push({isVideo: true, src: iframes[i].src, alt: 'Видео Youtube', thumb: 'http://img.youtube.com/vi/'+videoId+'/0.jpg', videoId: videoId});
            imagesSrc.push(videoId);
        }
    }

    // Youtube/Rutube (embed)
    var embeds = document.getElementsByTagName('embed');
    for (var i = 0; i < embeds.length; i++) {
        if ((videoId = /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/.exec(embeds[i].src)) && (videoId=videoId[2]) && !in_array(videoId, imagesSrc)) {
            window.pinmePanel.images.push({isVideo: true, src: embeds[i].src, alt: 'Видео Youtube', thumb: 'http://img.youtube.com/vi/'+videoId+'/0.jpg', videoId: videoId});
            imagesSrc.push(videoId);
        } else if ((videoId = /^https?:\/\/(www\.)?video\.rutube\.ru\/([a-z0-9]+)/.exec(embeds[i].src)) && (videoId=videoId[2]) && !in_array(videoId, imagesSrc)) {
            window.pinmePanel.images.push({isVideo: true, src: embeds[i].src, alt: 'Видео Rutube', thumb: 'http://tub.rutube.ru/thumbs/'+videoId.substr(0,2)+'/'+videoId.substr(2,2)+'/'+videoId+'-2.jpg', videoId: videoId});
            imagesSrc.push(videoId);
        }
    }

    if (!window.pinmePanel.images.length) {
        alert('No images to clip.');
        window.pinmePanel.proceed = false;
        return false;
    }

    temphide('embed');
    temphide('iframe');
    initPanel();

    var imgHtml = ''

    window.pinmePanel.images.sort(function(a,b)
    {
        if (a.isVideo && !b.isVideo) return -1;
        if (!a.isVideo && b.isVideo) return 1;
        if (a.isVideo && b.isVideo) return 0;

        if ((a.width*a.height) >= (b.width*b.height)) return -1;

        return 1;
    });

    for (var i = 0; i < window.pinmePanel.images.length; i++) {
        var img = window.pinmePanel.images[i];

        if (img.isVideo) {
            imgHtml += '<span class="pinmeImage" onclick="window.pinmePanel.select(this, '+i+')"><img src="' + img.thumb + '" alt="" title="" /><div class="pinmeInfo">' + img.alt + '</div><div class="pinmeIcoVideo"></div><div class="pinmeSelectButton"></div></span>';
        } else {
            imgHtml += '<span class="pinmeImage" onclick="window.pinmePanel.select(this, '+i+')"><img src="' + img.src + '" alt="' + img.alt + '" title="' + img.alt + '" /><div class="pinmeInfo">' + img.width + 'x' + img.height + '</div><div class="pinmeSelectButton"></div></span>';
        }
    }

    window.pinmePanel.imageContainer.innerHTML = imgHtml;
})();