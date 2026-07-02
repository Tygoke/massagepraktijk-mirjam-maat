/* Massagepraktijk Mirjam Maat — kleine markdown-renderer voor CMS-tekstvelden */
(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return s;
  }

  function mdToHtml(md) {
    if (!md) return '';
    var blocks = md.trim().split(/\n\s*\n/);
    return blocks.map(function (block) {
      var lines = block.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return '';
      if (lines[0].indexOf('## ') === 0) {
        return '<h2>' + inline(lines[0].slice(3)) + '</h2>';
      }
      if (lines.every(function (l) { return l.indexOf('- ') === 0; })) {
        return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.slice(2)) + '</li>'; }).join('') + '</ul>';
      }
      return '<p>' + inline(lines.join(' ')) + '</p>';
    }).join('\n');
  }

  window.mdToHtml = mdToHtml;

  window.laadMassagePagina = async function (jsonPath) {
    var el = {
      lead: document.getElementById('ms-lead'),
      tekst: document.getElementById('ms-tekst'),
      tag: document.getElementById('ms-tag'),
      figure: document.getElementById('ms-figure'),
      img: document.getElementById('ms-img'),
      info: document.getElementById('ms-info'),
      opmerking: document.getElementById('ms-opmerking'),
      cta: document.getElementById('ms-cta')
    };
    try {
      var res = await fetch(jsonPath);
      var d = await res.json();

      if (el.lead) el.lead.textContent = d.lead;
      if (el.tekst) el.tekst.innerHTML = mdToHtml(d.tekst);

      if (el.tag) {
        el.tag.textContent = d.status_label;
        el.tag.className = 'tag ' + d.status_type;
      }

      if (el.figure && el.img) {
        if (d.afbeelding) {
          el.img.src = d.afbeelding;
          el.figure.style.display = '';
        } else {
          el.figure.style.display = 'none';
        }
      }

      if (el.info && Array.isArray(d.info)) {
        el.info.innerHTML = d.info.map(function (r) {
          return '<dt>' + escapeHtml(r.label) + '</dt><dd>' + escapeHtml(r.waarde) + '</dd>';
        }).join('');
      }

      if (el.opmerking) {
        if (d.opmerking) {
          el.opmerking.textContent = d.opmerking;
          el.opmerking.style.display = '';
        } else {
          el.opmerking.style.display = 'none';
        }
      }

      if (el.cta) {
        var open = d.status_type === 'open';
        el.cta.className = open ? 'btn btn-primary btn-arrow' : 'btn btn-ghost';
        el.cta.textContent = open ? 'Afspraak maken' : 'Vraag naar mogelijkheden';
      }
    } catch (e) {
      if (el.tekst) el.tekst.innerHTML = '<p>Deze pagina kon momenteel niet worden geladen.</p>';
    }
  };
})();
