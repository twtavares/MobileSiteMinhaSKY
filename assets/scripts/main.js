function CampanhaSKY() { }

var campanhasky = new CampanhaSKY();

function Pages() { }

CampanhaSKY.prototype.pages = new Pages();

//retorna o sistema operacional
Pages.prototype.getOS = function () {     
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

//exibe loader em botão/link
Pages.prototype.buttonLoadingShow = function (currentElement) {

    var bcBtLoading = currentElement.find(".bc-bt-loading");
    var btLoading = currentElement.find(".bt-loading");

    bcBtLoading.fadeIn();
    btLoading.fadeIn();

    //console.info("buttonLoadingShow");
    //console.info(currentElement);

}

//click loader em button / a
Pages.prototype.buttonClickLoadingShow = function () {

    $("a,button").on("click", function (e) {
        CampanhaSKY.pages.buttonLoadingShow($(this));
        //console.info("buttonClickLoadingShow");
        //console.info($(this));
    });

}

//esconde loader em botão/link
Pages.prototype.buttonLoadingHide = function () {
    var bcBtLoading = $(".bc-bt-loading");
    var btLoading = $(".bt-loading");

    bcBtLoading.fadeOut();
    btLoading.fadeOut();

}

Pages.prototype.disableLink = function () {
    
    $(".inativo").off("click");
}

//chamada transições
Pages.prototype.transicaoManipulacaoElemento = function () {

    var current_fs, nextPrevHref; //fieldsets
    
    $(".lkn_prox, .lkn_voltar, #lkn_submit, .header__voltar").click(function (e) {
        e.preventDefault();        
console.log(current_fs);
        current_fs = $(this).parents(".step");                
        nextPrevHref = $(this).attr('href');
        
        //validação dos campos
        var formValida = campanhasky.pages.validaForm("formPDV");

        if ($(this).hasClass("header__voltar") === true) {
            
            if( nextPrevHref == "#step-1" ) $(".header__voltar").css("visibility", "hidden");  
            
            current_fs = $(".step.active");
            campanhasky.pages.transationsStepPrev(current_fs, nextPrevHref);

        }else if ($(this).hasClass("lkn_voltar") === true) {
            
            if( nextPrevHref == "#step-1" ) $(".header__voltar").css("visibility", "hidden");              
            campanhasky.pages.transationsStepPrev(current_fs, nextPrevHref);
           
            $(".header-step h2").animate({opacity: 1}, 100, function(){
                $("#linkCopy").animate({opacity: 0}, 500);
            });
        }else if ($(this).hasClass("lkn_prox") === true) { 
            
            $(".header__voltar").css("visibility", "visible");
            $(".header__voltar").attr("href","#"+current_fs[0].id);
            
            campanhasky.pages.transationsStepNext(current_fs, nextPrevHref);

        } else if ($(this).attr('id') == "lkn_submit") {
            
            if (formValida.valid() === true) {

                var pdvCurrent = $("input[name=txtPDV]").val();                            
                var verifyPDVCurrent = campanhasky.pages.verifyPDV(pdvCurrent);
                var currentHeaderInfo = $(".header-step.active");
                nextPrevHref =  $(this).attr('rel');
                
                //href="intent://minhasky.com.br/31267#Intent;scheme=minhasky;package=br.com.sky.selfcare;end"
                var urlShare = "minhasky.com.br/"+pdvCurrent;
                
                if(verifyPDVCurrent === false){
                    currentHeaderInfo.fadeOut("fast", function(){
                        $(".header-step").removeClass("active");
                        $(".header-step3").addClass("active");
                        $(".header-step3").fadeIn();
                        $(".num_pdv").text(pdvCurrent);
                    });
                
                }else{                                            
                                        
                    $(".header__voltar").css("visibility", "visible");
                    $(".header__voltar").attr("href","#"+current_fs[0].id);

                    $(".num_pdv").text(pdvCurrent);                    
                    $(".lkn-share").attr("href","http://"+urlShare);
                    $(".lkn-share").text(urlShare);
                    campanhasky.pages.transationsStepNext(current_fs, nextPrevHref);
                    currentHeaderInfo.fadeOut("fast", function(){
                        $(".header-step").removeClass("active");
                        $(".header-step1").fadeIn();                        
                    });                    
                }

            }
        }
    });
}

//exibe próximo step
Pages.prototype.transationsStepNext = function (current_fs, nextPrevHref) {
    var left, opacity, scale;
    var animating;

    if (animating) return false;
    animating = true;
    $(nextPrevHref).show();
    $(nextPrevHref).addClass("active");
    current_fs.animate({ opacity: 0 }, {
        step: function (now, mx) {
            scale = 1 - (1 - now) * 0.2;
            left = (now * 50) + "%";
            opacity = 1 - now;
            current_fs.css({ 'transform': 'scale(' + scale + ')' });            
            $(nextPrevHref).css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function () {
            current_fs.removeClass("active");
            current_fs.hide();
            animating = false;
            if(nextPrevHref == "#step-2") campanhasky.pages.onShareClick();
        }
    });

}

//exibe step anteior
Pages.prototype.transationsStepPrev = function (current_fs, nextPrevHref) {

    var left, opacity, scale;
    var animating;

    if (animating) return false;
    animating = true;

    $(nextPrevHref).show();
    $(nextPrevHref).addClass("active");
    current_fs.animate({ opacity: 0 }, {
        step: function (now, mx) {
            scale = 0.8 + (1 - now) * 0.2;
            left = ((1 - now) * 50) + "%";
            opacity = 1 - now;
            current_fs.css({ 'left': left });
            $(nextPrevHref).css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
        },
        duration: 800,
        complete: function () {
            current_fs.removeClass("active");
            current_fs.hide();
            animating = false;

            if (nextPrevHref == "#step-1") {
                $(".cadastro-social").fadeIn();
            }
            if(nextPrevHref == "#step-2") campanhasky.pages.onShareClick();
        }
    });

}

Pages.prototype.validaForm = function (form) {
    
    jQuery.validator.setDefaults({
        debug: false,
        success: "valid"
    });
    
    var form = $( "#"+form );            
    form.validate({        
        errorPlacement: function(error, element) {            
            return true;
        },
        highlight: function(element, errorClass) {                        
            $(".icon--alerta").fadeIn();            
            $(".header-step1, .header-step3").fadeOut("fast", function(){
                $(".header-step").removeClass("active");
                $(".header-step2").fadeIn().addClass("active")
            });
            this.findByName(element.name).removeClass(errorClass).addClass(errorClass);           
        },
        unhighlight: function(element, errorClass, validClass) {                                    
            $(".icon--alerta").fadeOut();            
            $(element).removeClass(errorClass).addClass(validClass);            
        },        
        rules: {            
            txtPDV: { 
                required: true
            }
        },
        messages: {
            txtPDV: { 
                required: "Por favor, digite seu PDV"
            }
        }
    });  
    return form;
}

Pages.prototype.verifyPDV = function(pdv){
//     var data = [
//     { "PDV": "1", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 417 },
// { "PDV": "V900970", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 359 },
// { "PDV": "V900967", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 355 },
// { "PDV": "V901325", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 240 },
// { "PDV": "V901996", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 212 },
// { "PDV": "V901180", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 195 },
// { "PDV": "V902186", "CATEGORIA": "CREDENCIADO MASTER", "QTDE FUNC ATIVOS": 191 },
// { "PDV": "ID90330", "CATEGORIA": "CREDENCIADO MASTER", "QTDE FUNC ATIVOS": 165 },
// { "PDV": "V902189", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 153 },
// { "PDV": "V900962", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 150 },
// { "PDV": "V901579", "CATEGORIA": "CREDENCIADO MASTER", "QTDE FUNC ATIVOS": 149 },
// { "PDV": "V904128", "CATEGORIA": "CREDENCIADO MASTER", "QTDE FUNC ATIVOS": 149 },
// { "PDV": "V905205", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 146 },
// { "PDV": "V111010", "CATEGORIA": "CREDENCIADO MASTER", "QTDE FUNC ATIVOS": 134 },
// { "PDV": "V902954", "CATEGORIA": "DISTRIBUIDOR", "QTDE FUNC ATIVOS": 131 }
// ]

    var isPDV;
    $.ajax({ 
        method: "GET",
        //window.location.origin
        url: window.location.origin +"/MobileSiteMinhaSKY/assets/scripts/pdvs.json",                        
        dataType: 'json',
        async: false
    }).done((data) => {        
        isPDV = data.filter(
            function(data) {
                return data.PDV == pdv;
            }
        );         
    }).fail((jqXhr) => {            
        console.log('Ajax erro');
    });

    if(isPDV.length > 0){
        return true;
    }else{
        return false;
    }  

}

Pages.prototype.onShareClick  = function(pdv){
    
    var urlShared = $(".lkn-share").text();    
    
    //share facebook
    $("#btnShareFacebook").click(function(e){
        e.preventDefault();
         FB.ui({
            method: 'share',
            title: 'Conheça o App Minha SKY',            
            href: 'https://'+urlShared,            
            picture: window.location.origin +"/MobileSiteMinhaSKY/assets/img/share.png",                
            caption: 'Conheça o App Minha SKY',
            description: 'A família SKY está cada vez maior! Agora com o aplicativo Minha SKY, você pode alugar os grandes lançamentos do cinema com apenas um clique para assistir na tela da sua TV!'
        }, function(response){
                console.log(response);
        });
        
    });

    //share twitter        
    $("#btnShareTwitter").attr('href','https://twitter.com/intent/tweet?url=https://'+urlShared+'/&text=Conheça o App Minha SKY')

    //share email    
    $("#btnShareEmail").attr('href','mailto:?subject=Conhe%E7a o App Minha SKY&body=Conhe%E7a o App Minha SKY %0A%0A A fam%EDlia SKY est%E1 cada vez maior%21 Agora com o aplicativo Minha SKY, voc%EA pode alugar os grandes lan%E7amentos do cinema com apenas um clique para assistir na tela da sua TV%21 %0A https://'+urlShared);

    //share whatsapp
    $("#btnShareWhatsapp").attr('href','whatsapp://send?text=http://www.twtavares.com.br/MobileSiteMinhaSKY');

    //share copy
    var clipboard = new Clipboard('.icon--copy');
    $("#btnShareCopy").attr("data-clipboard-text","https://"+urlShared)
    clipboard.on('success', function(e) {
        $(".header-step h2").animate({opacity: 0}, 100, function(){
            $("#linkCopy").animate({opacity: 1}, 500);
        });        

        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

Pages.prototype.verifyMobile = function(){
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    var isPdvUrl = campanhasky.pages.getParamsURL("pdv");
    if(isPdvUrl === true){
        if (isMobile.any("Android")){
            location.href = "https://play.google.com/store/apps/details?id=br.com.sky.selfcare&referrer=utm_source%3Dcampanhapdv%26utm_medium%3Dhotsite%26utm_campaign%3Dpdv";            
        }else if (isMobile.any("iOS")){
            location.href = "https://play.google.com/store/apps/details?id=br.com.sky.selfcare&referrer=utm_source%3Dcampanhapdv%26utm_medium%3Dhotsite%26utm_campaign%3Dpdv";
        }else{
            location.href = "https://www.sky.com.br/app";
        }
    }
    
}

Pages.prototype.getParamsURL = function(name){
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));    
}

Pages.prototype.init = function () {
    try {

        console.log('Main JS')        
        campanhasky.pages.onShareClick();
        
        // location.href = "https://play.google.com/store/apps/details?id=br.com.sky.selfcare&referrer=utm_source%3Dcampanhapdv%26utm_medium%3Dhotsite%26utm_campaign%3Dpdv";

        // intent://scan/#Intent;scheme=MinhaSKY;package=br.com.sky.selfcare;end

    } catch (e) {
        console.info(
			'Arquivo   : ' + e.fileName + ' \n ' +
			'Linha     : ' + e.lineNumber + ' \n ' +
			'Nome      : ' + e.name + ' \n ' +
			'Descricao : ' + e.message
		);

    };
}