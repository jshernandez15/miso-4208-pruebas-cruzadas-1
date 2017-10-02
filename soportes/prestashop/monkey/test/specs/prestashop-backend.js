
  function unleashGremlins(ttl, callback) {
    function stop() {
      horde.stop();
      callback();
    }
    var horde = window.gremlins.createHorde();
    horde
      .gremlin(gremlins.species.formFiller())
      .gremlin(
      gremlins.species.clicker()
        .canClick(function (elem) {
          if (elem.id === "page-header-desc-order-modules-list")
            return false;
          if ($(elem).hasClass('onboarding-button-resume')) {
            console.log("Clicker-No: onboarding");
            return false;
          }
          if (["a", "button"].includes(elem.tagName.toLowerCase())) {
            console.log("Clicker-Si:" + elem.tagName);
            return true;
          } else {
            console.log("Clicker-No:" + elem.tagName);
            return false;
          }
        })
      )
      .mogwai(gremlins.mogwais.gizmo().maxErrors(100))

      .strategy(gremlins.strategies.distribution()
        .distribution([0.2, 0.8])
      )
      .after(callback);
    window.onbeforeunload = stop;
    setTimeout(stop, ttl);
    horde.unleash();
  }

  function login(browser) {
    browser.url('http://bo.demo.prestashop.com/demo/index.php?controller=AdminLogin&email=demoes@prestashop.com&password=prestashop_demo');
    browser.execute(function () {

    });

    browser.click('.front_login button[name="submitLogin"]');
  }

  describe('PrestaShop ', function () {

    it('ejecuta monkey testing contra el backend', function () {
      login(browser);

      browser.waitForVisible('#subtab-AdminParentOrders');
      browser.click('#subtab-AdminParentOrders a');

      browser.timeoutsAsyncScript(60000);
      browser.executeAsync(loadScript);

      browser.timeoutsAsyncScript(60000);
      browser.executeAsync(unleashGremlins, 50000);

    });

    afterAll(function () {
      browser.log('browser').value.forEach(function (log) {
        browser.logger.info(log.message);
      });
      browser.end();
    });

  });

  function loadScript(callback) {
    var s = document.createElement('script');
    s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
    if (s.addEventListener) {
      s.addEventListener('load', callback, false);
    } else if (s.readyState) {
      s.onreadystatechange = callback
    }
    document.body.appendChild(s);
  }
