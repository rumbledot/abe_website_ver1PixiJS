//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

let logo,
    oldMouseX, oldMouseY, mouseX, mouseY;
let menuOpen = false;
let floatMenuAlpha = 0;

var width = 1280;
var height = 720;

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

let text_about;

let text_about_deg = 270;

let distance = 240;
let dragging = false;

let orbit = new PIXI.Graphics();
let planet01 = new PIXI.Graphics();
let planet02 = new PIXI.Graphics();
let planet03 = new PIXI.Graphics();
let planet04 = new PIXI.Graphics();

let sp_orbit = new Sprite();
let sp_planet01 = new Sprite();
let sp_planet02 = new Sprite();
let sp_planet03 = new Sprite();
let sp_planet04 = new Sprite();

var isMobile = isMobile();

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

    const menuLayer = new PIXI.Container();
    app.stage.addChild(menuLayer);

    // Text Styles
    const styleSmall = new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 20,
        fill: ['#000000'],
        stroke: '#9badb7',
        strokeThickness: 1,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    // The Fun Begin here
    function setup() {
        window.addEventListener('resize', resize);
        resize();
    }

    // What make 'em ticks
    // internal function called on an interval
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
        if (isMobile) {
            app.renderer.resize(screen.width, screen.height);
        }
        else {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        }
        setGrid();
        planets();
        centerLogo();
        menuTexts();
    }

    function planets() {
        app.stage.removeChild(circleLayer);
        app.stage.addChild(circleLayer);

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
        text_about = new PIXI.Text('2020|Abe', styleSmall);

        text_about.anchor.set(0.5);
        text_about.position.set(app.screen.width / 2, app.screen.height / 2 + 110);
        app.stage.addChild(text_about);
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
});