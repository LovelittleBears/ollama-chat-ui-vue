import markdownIt from "markdown-it";
import hljs from "highlightjs";

const md = markdownIt({
  highlight: function (str, lang) {
    /* 
      添加行号、复制按钮。
      复制按钮的事件需要在组件中添加。
    */
    let html =
      '<div class="copy-action"><div class="icon-copy"></div></div>' +
      '<div class="ln-action"><div class="icon-ln"></div></div>';
    let lnLabel = '<span aria-hidden="true" class="line-numbers-rows">';
    lnLabel += "<span></span>".repeat(str.split(/\n/).length - 1) + "</span>";
    const langLabel = `<b class="code-lang">${lang || "Unknown"}</b>`;
    if (lang) {
      if (hljs.getLanguage(lang)) {
        html += hljs.highlight(lang, str, true).value;
        return `<pre class="hljs x-pre">${langLabel}<code class=x-code>${html}</code>${lnLabel}</pre>`;
      }
    }
    const preCode = md.utils.escapeHtml(str);
    return `<pre class="hljs x-pre">${langLabel}<code class="x-code">${
      html + preCode
    }</code>${lnLabel}</pre>`;
  },
});

// md.use(function(md) {
//   md.block.ruler.before('paragraph', 'think', function (state,startLine,endLine) {
//     console.log(111)
//     var ch, level, tmp, token
//   })
// })

// 自定义规则，添加类名
md.core.ruler.push("custom-rule", (state) => {
  handle(state.tokens);
  function handle(tokens) {
    for (const token of tokens) {
      // 标题
      addClass(token, "h1", "x-heading x-h1");
      addClass(token, "h2", "x-heading x-h2");
      addClass(token, "h3", "x-heading x-h3");
      addClass(token, "h4", "x-heading x-h4");
      addClass(token, "h5", "x-heading x-h5");
      // 表格
      addClass(token, "table", "x-table");
      addClass(token, "thead", "x-thead");
      addClass(token, "tbody", "x-tbody");
      // addClass(token, 'tr', 'x-tr')
      // addClass(token, 'th', 'x-th')
      // addClass(token, 'td', 'x-td')
      // 列表
      addClass(token, "ul", "x-ul");
      addClass(token, "ol", "x-ol");
      addClass(token, "li", "x-li");
      // ---
      addClass(token, "img", "x-img");
      addClass(token, "blockquote", "x-blockquote");
      addClass(token, "code", "x-code");
      addClass(token, "quote", "x-quote");
      addClass(token, "p", "x-p");
      addClass(token, "em", "x-em");
      addClass(token, "strong", "x-strong");
      addClass(token, "a", "x-a");
      addClass(token, "hr", "x-hr");
      addClass(token, "div", "x-x-div");
      if (token.children?.length) handle(token.children);
    }
  }

  function addClass(token, tagName, ...classNames) {
    if (token.tag === tagName) {
      const c = token.attrGet("class") || "";
      token.attrSet("class", `${c ? c + " " : ""}${classNames.join(" ")}`);
    }
  }
});
const render = (s) => s && md.render(s);

export { render, md };
