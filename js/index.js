//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

let logo,
    oldMouseX, oldMouseY, mouseX, mouseY;

let justLoaded = true;

let orbitCenter, posGraph;
let orbitDeg = 225;
let planet01Deg = 45;
let planet02Deg = 120;
let planet03Deg = 160;
let planet04Deg = 180;

let orbitDegFactor = 0.5;
let planet01DegFactor = 0.2;
let planet02DegFactor = 0.5;
let planet03DegFactor = 0.6;
let planet04DegFactor = 0.8;

let text_blogs, text_dusun, text_git, text_twitter, text_about, text_title, oldText;

let text_blogs_deg = 360;
let text_dusun_deg = 90;
let text_git_deg = 180;
let text_about_deg = 270;
let rotationRate = 20;

let distance = 240;
let dragging = false;

let orbit = new PIXI.Graphics();
let elipse01 = new PIXI.Graphics();
let elipse02 = new PIXI.Graphics();
let planet01 = new PIXI.Graphics();
let planet02 = new PIXI.Graphics();
let planet03 = new PIXI.Graphics();
let planet04 = new PIXI.Graphics();

let sp_orbit = new Sprite();
let sp_elipse01 = new Sprite();
let sp_elipse02 = new Sprite();
let sp_planet01 = new Sprite();
let sp_planet02 = new Sprite();
let sp_planet03 = new Sprite();
let sp_planet04 = new Sprite();

$(document).ready(function () {

    // create PIXI Application
    let app = new Application({
        view: lander,
        autoResize: true,
        backgroundColor: 0xffffff,
        resolution: devicePixelRatio
    });
    document.body.appendChild(app.view);

    // Loading assets
    loader
        .add([
            { name: "grid", url: "/images/grid.png" },
            { name: "grid_o", url: "/images/grid_overlay.png" },
            { name: "logo", url: "/images/logo_ak.png" },
            { name: "SummerGarden", url: "/fonts/Summer Garden.ttf" },
        ])
        .load(setup);

    // Containers
    const grids = new PIXI.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
    });
    app.stage.addChild(grids);

    const grid_overlays = new PIXI.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
    });
    app.stage.addChild(grid_overlays);

    const circleLayer = new PIXI.Container();
    app.stage.addChild(circleLayer);

    // Text Styles
    const style = new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 70,
        fill: ['#ffffff'],
        stroke: '#9badb7',
        strokeThickness: 2,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const styleMessage = new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 30,
        fill: ['#000000'],
        stroke: '#9badb7',
        strokeThickness: 1,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    const styleSmall = new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 20,
        fill: ['#000000'],
        stroke: '#9badb7',
        strokeThickness: 1,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    const styleOver = new PIXI.TextStyle({
        fontFamily: 'SummerGarden',
        fontSize: 70,
        fill: ['#000000'],
        stroke: '#9badb7',
        strokeThickness: 1,
        dropShadow: true,
        dropShadowColor: '#9badb7',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    // The Fun Begin here
    function setup() {
        app.stage.interactive = true;
        app.stage.on('pointerdown', pointerDown);
        app.stage.on('pointerup', pointerUp);
        app.stage.on('pointermove', pointerMove);

        window.addEventListener('resize', resize);

        resize();
    }

    // What make 'em ticks
    app.ticker.add(function (delta) {
        orbitDeg += orbitDegFactor;
        planet01Deg += planet01DegFactor;
        planet02Deg += planet02DegFactor;
        planet03Deg += planet03DegFactor;
        planet04Deg += planet04DegFactor;
        animatePlanets();
    });

    // Functions
    function resize() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        setGrid();
        planets();
        centerLogo();
        menuTexts();
    }

    function planets() {
        app.stage.removeChild(circleLayer);
        app.stage.addChild(circleLayer);

        elipse01.lineStyle(2, 0xf6f6f6, 1);
        elipse01.drawEllipse(0, 0, 200, 100);
        elipse01.pivot.x = 0;
        elipse01.pivot.y = 0;
        sp_elipse01.addChild(elipse01);
        sp_elipse01.anchor.set(0.5);
        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, 0, distance);
        sp_elipse01.position.set(posText.x, posText.y);
        circleLayer.addChild(sp_elipse01);

        elipse02.lineStyle(2, 0xf6f6f6, 1);
        elipse02.drawEllipse(0, 0, 150, 80);
        elipse02.pivot.x = 0;
        elipse02.pivot.y = 0;
        sp_elipse02.addChild(elipse02);
        sp_elipse02.anchor.set(0.5);
        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, 0, distance);
        sp_elipse02.position.set(posText.x, posText.y);
        circleLayer.addChild(sp_elipse02);

        orbit.lineStyle(2, 0xf6f6f6, 1);
        orbit.drawCircle(0, 0, 200);
        orbit.pivot.x = 50;
        orbit.pivot.y = 50;
        sp_orbit.addChild(orbit);
        sp_orbit.anchor.set(0.5);
        circleLayer.addChild(sp_orbit);

        planet01.lineStyle(2, 0xf6f6f6, 1);
        planet01.drawCircle(0, 0, 90);
        planet01.pivot.x = 50;
        planet01.pivot.y = 50;
        sp_planet01.addChild(planet01);
        sp_planet01.anchor.set(0.5);
        circleLayer.addChild(sp_planet01);

        planet02.lineStyle(2, 0xf6f6f6, 1);
        planet02.drawCircle(0, 0, 60);
        planet02.pivot.x = 50;
        planet02.pivot.y = 50;
        sp_planet02.addChild(planet02);
        sp_planet02.anchor.set(0.5);
        circleLayer.addChild(sp_planet02);

        planet03.lineStyle(2, 0xf6f6f6, 1);
        planet03.drawCircle(0, 0, 30);
        planet03.pivot.x = 50;
        planet03.pivot.y = 50;
        sp_planet03.addChild(planet03);
        sp_planet03.anchor.set(0.5);
        circleLayer.addChild(sp_planet03);

        planet04.lineStyle(2, 0xf6f6f6, 1);
        planet04.drawCircle(0, 0, 10);
        planet04.pivot.x = 50;
        planet04.pivot.y = 50;
        sp_planet04.addChild(planet04);
        sp_planet04.anchor.set(0.5);
        circleLayer.addChild(sp_planet04);
    }

    function animatePlanets() {
        posGraph = getRadPosition(app.screen.width / 2, app.screen.height / 2, orbitDeg, 10);
        sp_orbit.position.set(posGraph.x, posGraph.y);

        orbitCenter = posGraph;
        posGraph = getRadPosition(orbitCenter.x, orbitCenter.y, planet01Deg, 200);
        sp_planet01.position.set(posGraph.x, posGraph.y);

        posGraph = getRadPosition(orbitCenter.x, orbitCenter.y, planet02Deg, 200);
        sp_planet02.position.set(posGraph.x, posGraph.y);

        posGraph = getRadPosition(orbitCenter.x, orbitCenter.y, planet03Deg, 200);
        sp_planet03.position.set(posGraph.x, posGraph.y);

        posGraph = getRadPosition(orbitCenter.x, orbitCenter.y, planet04Deg, 200);
        sp_planet04.position.set(posGraph.x, posGraph.y);
    }

    function menuTexts() {
        text_blogs = new PIXI.Text('Blogs', style);
        text_dusun = new PIXI.Text('Dusun', style);
        text_git = new PIXI.Text('GitHub', style);
        text_twitter = new PIXI.Text('Twitter', style);
        text_about = new PIXI.Text('2020|Abe', styleSmall);
        text_title = new PIXI.Text('Abe\'s Pfolio: \n caution! \n experiments ahead..', styleMessage);
        text_info = new PIXI.Text('use scroll up/down', styleMessage);

        if (app.screen.width > 700) {
            text_title.position.set(app.screen.width / 2 - 350, app.screen.height / 2 - 90);
            app.stage.addChild(text_title);
        } else {
            text_title.position.set(app.screen.width / 2 - 90, app.screen.height / 2 - 350);
            app.stage.addChild(text_title);
        }

        if (justLoaded) {
            text_info.anchor.set(0.5);
            text_info.position.set(app.screen.width / 2, app.screen.height / 2 - 150);
            app.stage.addChild(text_info);
        }

        text_about.anchor.set(0.5);
        text_about.position.set(app.screen.width / 2, app.screen.height / 2 + 110);
        app.stage.addChild(text_about);

        text_blogs.interactive = true;
        text_blogs.buttonMode = true;
        text_blogs
            .on('pointerover', onButtonOver)
            .on('pointerout', onButtonOut)
            .on('pointerdown', gotoBlogs);
        text_blogs.anchor.set(0.5);
        app.stage.addChild(text_blogs);

        text_dusun.interactive = true;
        text_dusun.buttonMode = true;
        text_dusun
            .on('pointerover', onButtonOverCS)
            .on('pointerout', onButtonOut)
            .on('pointerdown', gotoDusun);
        text_dusun.anchor.set(0.5);
        app.stage.addChild(text_dusun);

        text_git.interactive = true;
        text_git.buttonMode = true;
        text_git
            .on('pointerover', onButtonOver)
            .on('pointerout', onButtonOut)
            .on('pointerdown', gotoGitHub);
        text_git.anchor.set(0.5);
        app.stage.addChild(text_git);

        text_twitter.interactive = true;
        text_twitter.buttonMode = true;
        text_twitter
            .on('pointerover', onButtonOver)
            .on('pointerout', onButtonOut)
            .on('pointerdown', gotoTwitter);
        text_twitter.anchor.set(0.5);
        app.stage.addChild(text_twitter);

        animateTexts();
    }

    function setGrid() {
        app.stage.removeChild(grids);
        app.stage.addChild(grids);
        app.stage.removeChild(grid_overlays);
        app.stage.addChild(grid_overlays);

        for (let gX = 0; gX < app.screen.width; gX += 120) {
            for (let gY = 0; gY < app.screen.height; gY += 120) {
                let grid = new Sprite(resources.grid.texture);
                let grid_o = new Sprite(resources.grid_o.texture);
                grid.position.set(gX, gY);
                grid_o.position.set(gX, gY);
                grids.addChild(grid);
                grid_overlays.addChild(grid_o);
            }
        }
    }

    function centerLogo() {
        logo = new Sprite(resources.logo.texture);
        logo.scale.set(0.6);
        logo.anchor.set(0.5);
        logo.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(logo);
    }

    function animateTexts() {
        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_blogs_deg, distance);
        text_blogs.scale.set(Math.abs(text_blogs_deg - 180) / 180);
        text_blogs.position.set(posText.x, posText.y);
        text_blogs.rotation = degToRad(text_blogs_deg);

        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_dusun_deg, distance);
        text_dusun.scale.set(Math.abs(text_dusun_deg - 180) / 180);
        text_dusun.position.set(posText.x, posText.y);
        text_dusun.rotation = degToRad(text_dusun_deg);

        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_git_deg, distance);
        text_git.scale.set(Math.abs(text_git_deg - 180) / 180);
        text_git.position.set(posText.x, posText.y);
        text_git.rotation = degToRad(text_git_deg);

        posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_about_deg, distance);
        text_twitter.scale.set(Math.abs(text_about_deg - 180) / 180);
        text_twitter.position.set(posText.x, posText.y);
        text_twitter.rotation = degToRad(text_about_deg);
    }

    $(document).on('mousewheel', function (event) {
        if (justLoaded) {
            justLoaded = false;
            app.stage.removeChild(text_info);
        }

        if (event.deltaY == 1) {
            text_blogs_deg >= 360 ? text_blogs_deg = 0 : text_blogs_deg += rotationRate;
            text_dusun_deg >= 360 ? text_dusun_deg = 0 : text_dusun_deg += rotationRate;
            text_git_deg >= 360 ? text_git_deg = 0 : text_git_deg += rotationRate;
            text_about_deg >= 360 ? text_about_deg = 0 : text_about_deg += rotationRate;
            orbitDegFactor = 0.5;
            planet01DegFactor = 0.2;
            planet02DegFactor = 0.5;
            planet03DegFactor = 0.6;
            planet04DegFactor = 0.8;
        } else {
            text_blogs_deg <= 0 ? text_blogs_deg = 360 : text_blogs_deg -= rotationRate;
            text_dusun_deg <= 0 ? text_dusun_deg = 360 : text_dusun_deg -= rotationRate;
            text_git_deg <= 0 ? text_git_deg = 360 : text_git_deg -= rotationRate;
            text_about_deg <= 0 ? text_about_deg = 360 : text_about_deg -= rotationRate;
            orbitDegFactor = -0.5;
            planet01DegFactor = -0.2;
            planet02DegFactor = -0.5;
            planet03DegFactor = -0.6;
            planet04DegFactor = -0.8;
        }
        animateTexts();
    });

    function pointerMove(event) {
        let mX = event.data.global.x;
        let mY = event.data.global.y;
        let centerX = app.screen.width / 2;
        let centerY = app.screen.height / 2;
        grid_overlays.position.x = (mX - centerX) / 50;
        grid_overlays.position.y = (mY - centerY) / 50;
        grids.position.x = (centerX - mX) / 100;
        grids.position.y = (centerY - mY) / 100;
    }

    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
    }

    function pointerUp(event) {
        dragging = false;
    }

    function onButtonOver() {
        oldText = this.text;
        this.isOver = true;
        this.style = styleOver;
        this.dirty = true;
    }

    function onButtonOverCS() {
        oldText = this.text;
        this.isOver = true;
        this.style = styleMessage;
        this.text = '[coming soon]';
        this.dirty = true;
    }

    function onButtonOut() {
        this.text = oldText;
        this.isOver = false;
        this.style = style;
        this.dirty = true;
    }

    function onClick() {
        this.tint = Math.random() * 0xFFFFFF;
    }

    function gotoBlogs() {
        var win = window.open('http://abraham-kurnanto.com/website/public', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this website');
        }
    }

    function gotoDusun() {

    }

    function gotoGitHub() {
        var win = window.open('https://github.com/rumbledot', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this website');
        }
    }

    function gotoTwitter() {
        var win = window.open('https://twitter.com/RumbleDot', '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this website');
        }
    }

});