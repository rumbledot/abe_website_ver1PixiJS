//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;

let logo,
    oldMouseX, oldMouseY, mouseX, mouseY;

let text_blogs, text_dusun, text_profile, text_about;

let text_blogs_deg = 360;
let text_dusun_deg = 90;
let text_profile_deg = 180;
let text_about_deg = 270;
let rotationRate = 20;

let distance = 200;
let dragging = false;

$(document).ready(function () {

    // create PIXI Application
    let app = new Application({
        view: lander,
        autoResize: true,
        backgroundColor: 0xffffff,
        resolution: devicePixelRatio
    });
    document.body.appendChild(app.view);

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

    const style = new PIXI.TextStyle({
        fontFamily: 'Calibri Light',
        fontSize: 70,
        fill: ['#ffffff'],
        stroke: '#9badb7',
        strokeThickness: 2,
        dropShadow: false,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const styleOver = new PIXI.TextStyle({
        fontFamily: 'Calibri Light',
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

    // Loading assets
    loader
        .add([
            { name: "grid", url: "/images/grid.png" },
            { name: "grid_o", url: "/images/grid_overlay.png" },
            { name: "logo", url: "/images/logo_ak.png" },
            { name: "text_blog", url: "/images/text_blog.png" },
        ])
        .load(setup);

    function setup() {
        app.stage.interactive = true;
        app.stage.on('pointerdown', pointerDown);
        app.stage.on('pointerup', pointerUp);
        app.stage.on('pointermove', pointerMove);

        window.addEventListener('resize', resize);

        function resize() {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            setGrid();

            let circle01 = new PIXI.Graphics();
            circle01.lineStyle(2, 0xf6f6f6, 1);
            circle01.drawCircle(app.screen.width / 2, app.screen.height / 2, 200);
            app.stage.addChild(circle01);

            let circle02 = new PIXI.Graphics();
            circle02.lineStyle(2, 0xddf2f6, 1);
            circle02.drawCircle(app.screen.width / 2, app.screen.height / 2, 90);
            circle02.pivot.x = 70;
            circle02.pivot.y = 70;
            circle02.rotate = 0.8;
            app.stage.addChild(circle02);

            centerLogo();

            // text_blogs = new Sprite(resources.text_blog.texture);
            text_blogs = new PIXI.Text('Blogs', style);
            text_dusun = new PIXI.Text('Dusun', style);
            text_profile = new PIXI.Text('GitHub', style);
            text_about = new PIXI.Text('Twitter', style);

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
                .on('pointerover', onButtonOver)
                .on('pointerout', onButtonOut)
                .on('pointerdown', gotoDusun);
            text_dusun.anchor.set(0.5);
            app.stage.addChild(text_dusun);

            text_profile.interactive = true;
            text_profile.buttonMode = true;
            text_profile
                .on('pointerover', onButtonOver)
                .on('pointerout', onButtonOut)
                .on('pointerdown', gotoGitHub);
            text_profile.anchor.set(0.5);
            app.stage.addChild(text_profile);

            text_about.interactive = true;
            text_about.buttonMode = true;
            text_about
                .on('pointerover', onButtonOver)
                .on('pointerout', onButtonOut)
                .on('pointerdown', gotoTwitter);
            text_about.anchor.set(0.5);
            app.stage.addChild(text_about);

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

            posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_profile_deg, distance);
            text_profile.scale.set(Math.abs(text_profile_deg - 180) / 180);
            text_profile.position.set(posText.x, posText.y);
            text_profile.rotation = degToRad(text_profile_deg);

            posText = getRadPosition(app.screen.width / 2, app.screen.height / 2, text_about_deg, distance);
            text_about.scale.set(Math.abs(text_about_deg - 180) / 180);
            text_about.position.set(posText.x, posText.y);
            text_about.rotation = degToRad(text_about_deg);
        }

        $(document).on('mousewheel', function (event) {
            if (event.deltaY == 1) {
                text_blogs_deg >= 360 ? text_blogs_deg = 0 : text_blogs_deg += rotationRate;
                text_dusun_deg >= 360 ? text_dusun_deg = 0 : text_dusun_deg += rotationRate;
                text_profile_deg >= 360 ? text_profile_deg = 0 : text_profile_deg += rotationRate;
                text_about_deg >= 360 ? text_about_deg = 0 : text_about_deg += rotationRate;
            } else {
                text_blogs_deg <= 0 ? text_blogs_deg = 360 : text_blogs_deg -= rotationRate;
                text_dusun_deg <= 0 ? text_dusun_deg = 360 : text_dusun_deg -= rotationRate;
                text_profile_deg <= 0 ? text_profile_deg = 360 : text_profile_deg -= rotationRate;
                text_about_deg <= 0 ? text_about_deg = 360 : text_about_deg -= rotationRate;
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
            this.isOver = true;
            this.style = styleOver;
            this.dirty = true;
        }

        function onButtonOut() {
            this.isOver = false;
            this.style = style;
            this.dirty = true;
        }

        function onClick() {
            console.log("clicked");
            this.tint = Math.random() * 0xFFFFFF;
        }

        function gotoBlogs() {

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

        resize();
    }
});