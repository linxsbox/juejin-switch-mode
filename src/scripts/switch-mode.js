import { name, version, description, author, license } from "../../package.json";

const DARK_SIGN = "__dark";
const STORE_SIGN = "switch-mode";

/**
 * 获取存储的模式状态
 * @returns true | false
 */
const isDark = () =>
  window.localStorage.getItem(STORE_SIGN) === "true" ? true : false;

/**
 * 初始化切换模式的元素
 * @returns true
 */
const initSwithcModeElem = async () => {
  const tempEl = document.createElement("div");

  tempEl.className = "switch-mode-box";
  tempEl.innerHTML =
    '<input type="checkbox" id="toggle-mode" class="toggle-mode" hidden /><label class="toggle-mode-btn" for="toggle-mode"></label><div class="toggle-icon"></div>';
  document.querySelector("body").appendChild(tempEl);

  return true;
};

/**
 * 初始化切换模式的状态
 * @returns true
 */
const initSwithcModeStatus = async () => {
  const htmlEL = document.querySelector("html");
  const toggleMode = document.querySelector(".switch-mode-box>.toggle-mode");

  if (!isDark()) {
    window.localStorage.setItem(STORE_SIGN, toggleMode.checked);
  } else {
    const status = isDark();
    toggleMode.checked = status;
    htmlEL.classList.toggle(DARK_SIGN, status);

    window.localStorage.setItem(STORE_SIGN, status);
  }

  toggleMode.addEventListener("change", () => {
    htmlEL.classList.toggle(DARK_SIGN, toggleMode.checked);

    const mdBody = document.querySelector(".markdown-body");
    mdBody && mdBody.classList.toggle(DARK_SIGN, toggleMode.checked);

    window.localStorage.setItem(STORE_SIGN, toggleMode.checked);
    isSupportDark(mdBody, toggleMode.checked);
  });

  return true;
};

/**
 * 判断主题是否支持深色模式
 * @param {*} mdBody 文章主题元素
 * @param {*} toggle 判断支持切换
 * @returns
 */
const isSupportDark = (mdBody, toggle) => {
  const isMdStyle = document.querySelector(".markdown-body style");
  const isMdDtf = document.querySelector(".markdown-body.dtf");
  if (!isMdStyle || isMdDtf) return;
  if (
    !(
      /--cyanosis-/gi.test(isMdStyle.innerText) &&
      /var\(/gi.test(isMdStyle.innerText)
    )
  ) {
    mdBody && mdBody.classList.toggle("dtf", toggle);
  }
};

/**
 * 初始化监听文章元素变化
 * @returns
 */
const initObserveMdBody = () => {
  const mainArea = document.querySelector(".main-area");

  if (!mainArea) return;

  const config = { attributes: true, childList: true, subtree: true };
  const observerEl = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "childList" &&
        (mutation.target.className === "markdown-body" ||
          mutation.target.className === `markdown-body ${DARK_SIGN}`)
      ) {
        mutation.target.classList.toggle(DARK_SIGN, isDark());
        isSupportDark(mutation.target, isDark());
      }
      //  else if (mutation.type === "attributes") {
      // }
    }
  });
  observerEl.observe(mainArea, config);
};

/**
 * 监听 URL 变化，如果为文章详情则调用监听元素变化
 */
const initListenerForUrl = () => {
  window.addEventListener("popstate", (e) => {
    /\/post\//gi.test(window.location.pathname) && initObserveMdBody();
  });
};

const init = async () => {
  await initSwithcModeElem();
  await initSwithcModeStatus();
  initListenerForUrl();
};

init();

const tips = () => {
  console.log(`%c${description} v${version}`, "font-weight: bold;");
  console.log(`[${license}] ${name}`);
  console.log(`作者：林小帅（${author}）\n`);
  console.log("掘金：https://juejin.cn/user/3175045313873943\n");
};

tips();
