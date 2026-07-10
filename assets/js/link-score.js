(function () {
  'use strict';

  var root = document.querySelector('[data-share-url].link-score-app');
  if (!root) return;

  var MAX_SCORE_PER_QUESTION = 6.25;
  var ANALYSIS_DELAY = 3600;
  var STEP_DELAY = 260;

  var levels = [
    {
      id: 'foundation',
      name: 'Foundation',
      range: '0-25',
      min: 0,
      max: 25,
      next: 'Growth',
      nextMin: 26,
      description: 'Ваш профіль - це чисте полотно, яке чекає на ваші ідеї. Це класний момент, щоб закласти фундамент для майбутніх успіхів.'
    },
    {
      id: 'growth',
      name: 'Growth',
      range: '26-50',
      min: 26,
      max: 50,
      next: 'Professional',
      nextMin: 51,
      description: 'Ви вже маєте базу, тепер час перетворити її на інструмент для росту. Ви на правильному шляху до крутих результатів.'
    },
    {
      id: 'professional',
      name: 'Professional',
      range: '51-75',
      min: 51,
      max: 75,
      next: 'Authority',
      nextMin: 76,
      description: 'Ваш профіль виглядає солідно. Ви вже створюєте цінність і будуєте мережу контактів. Тепер час масштабувати цей успіх.'
    },
    {
      id: 'authority',
      name: 'Authority',
      range: '76-100',
      min: 76,
      max: 100,
      next: null,
      nextMin: null,
      description: 'Ваш LinkedIn працює як потужний актив. Ви не просто присутні, ви створюєте вплив та привертаєте можливості.'
    }
  ];

  var questions = [
    {
      axis: 'LOOK',
      title: 'Яке фото зараз встановлено у вашому профілі?',
      answers: [
        { text: 'Немає фотографії', weight: 0 },
        { text: 'Випадкове фото / селфі', weight: 2 },
        { text: 'Гарне особисте фото', weight: 4 },
        { text: 'Професійна портретна фотографія', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'LOOK',
      title: 'Як виглядає ваш банер?',
      answers: [
        { text: 'Банера немає', weight: 0 },
        { text: 'Стандартний фон LinkedIn', weight: 2 },
        { text: 'Є зображення, але воно нічого не пояснює', weight: 4 },
        { text: 'Банер одразу пояснює, чим я займаюся або яку цінність даю', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'LOOK',
      title: 'Наскільки заповнений розділ About?',
      answers: [
        { text: 'Не заповнений', weight: 0 },
        { text: 'Декілька речень', weight: 2 },
        { text: 'Заповнений повністю, але давно не оновлювався', weight: 4 },
        { text: 'Повністю оформлений, регулярно оновлюється і відображає мою експертизу', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'LOOK',
      title: 'Якщо незнайома людина відкриє ваш профіль, за скільки секунд вона зрозуміє, чим ви займаєтесь?',
      answers: [
        { text: 'Скоріш за все, не зрозуміє', weight: 0 },
        { text: 'Знадобиться уважно читати профіль', weight: 2 },
        { text: 'Зрозуміє приблизно за хвилину', weight: 4 },
        { text: 'Зрозуміє за перші 5-10 секунд', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'INFLUENCE',
      title: 'Як часто ви публікуєте новий контент у LinkedIn?',
      answers: [
        { text: 'Практично ніколи', weight: 0 },
        { text: '1-2 публікації на місяць', weight: 2 },
        { text: 'Приблизно 1 публікація на тиждень', weight: 4 },
        { text: '2 і більше публікацій на тиждень', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'INFLUENCE',
      title: 'Яке середнє охоплення набирають ваші останні публікації?',
      help: 'Якщо не знаєте - відкрийте останні 5 постів і оцініть середню кількість показів.',
      answers: [
        { text: 'До 500 показів', weight: 0 },
        { text: '500-2 000', weight: 2 },
        { text: '2 000-10 000', weight: 4 },
        { text: 'Більше 10 000', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'INFLUENCE',
      title: 'Який тип публікацій ви створюєте найчастіше?',
      answers: [
        { text: 'Практично не публікую', weight: 0 },
        { text: 'Переважно новини або репости', weight: 2 },
        { text: 'Корисні поради та експертні матеріали', weight: 4 },
        { text: 'Особистий досвід, історії, кейси та експертний контент', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'INFLUENCE',
      title: 'Як часто ваші публікації отримують коментарі?',
      answers: [
        { text: 'Майже ніколи', weight: 0 },
        { text: 'Іноді (1-3 коментарі)', weight: 2 },
        { text: 'Регулярно (4-10 коментарів)', weight: 4 },
        { text: 'Майже кожна публікація отримує активне обговорення', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'NETWORK',
      title: 'Скільки нових професійних контактів ви додаєте у LinkedIn за тиждень?',
      answers: [
        { text: 'Не додаю', weight: 0 },
        { text: 'До 5 осіб', weight: 2 },
        { text: '5-20 осіб', weight: 4 },
        { text: 'Більше 20 осіб', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'NETWORK',
      title: 'Що відбувається після того, як людина приймає ваше запрошення?',
      answers: [
        { text: 'Нічого', weight: 0 },
        { text: 'Іноді надсилаю повідомлення', weight: 2 },
        { text: 'Зазвичай починаю діалог', weight: 4 },
        { text: 'Майже завжди надсилаю персоналізоване повідомлення і продовжую спілкування', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'NETWORK',
      title: 'Як часто ви коментуєте публікації інших людей?',
      answers: [
        { text: 'Практично ніколи', weight: 0 },
        { text: 'Декілька разів на місяць', weight: 2 },
        { text: 'Декілька разів на тиждень', weight: 4 },
        { text: 'Практично щодня', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'NETWORK',
      title: 'Як часто ви отримуєте вхідні повідомлення від людей, яких раніше не знали?',
      answers: [
        { text: 'Практично ніколи', weight: 0 },
        { text: 'Декілька разів на місяць', weight: 2 },
        { text: 'Декілька разів на тиждень', weight: 4 },
        { text: 'Майже щодня', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'KONVERSION',
      title: 'Чи є у вашому профілі зрозумілий наступний крок для відвідувача?',
      help: 'Наприклад: записатися на консультацію, завантажити матеріал, написати повідомлення.',
      answers: [
        { text: 'Немає', weight: 0 },
        { text: 'Є, але його важко помітити', weight: 2 },
        { text: 'Є один зрозумілий заклик до дії', weight: 4 },
        { text: 'Весь профіль логічно веде до наступного кроку', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'KONVERSION',
      title: 'Що відбувається після того, як людина зацікавилась вашим профілем?',
      answers: [
        { text: 'Нічого', weight: 0 },
        { text: 'Може написати мені напряму', weight: 2 },
        { text: 'Я пропоную безкоштовний матеріал або перший корисний крок', weight: 4 },
        { text: 'У мене є зрозуміла система, яка переводить людину до наступного етапу', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'KONVERSION',
      title: 'Як часто LinkedIn приносить вам реальні можливості?',
      help: 'Клієнти, офери, запрошення на інтерв\'ю, партнерства.',
      answers: [
        { text: 'Практично ніколи', weight: 0 },
        { text: 'Декілька разів на рік', weight: 2 },
        { text: 'Декілька разів на місяць', weight: 4 },
        { text: 'Практично щотижня', weight: MAX_SCORE_PER_QUESTION }
      ]
    },
    {
      axis: 'KONVERSION',
      title: 'Яка частина ваших професійних можливостей сьогодні приходить через LinkedIn?',
      answers: [
        { text: 'Практично ніяка', weight: 0 },
        { text: 'Менше 25%', weight: 2 },
        { text: 'Приблизно половина', weight: 4 },
        { text: 'Більше 75%', weight: MAX_SCORE_PER_QUESTION }
      ]
    }
  ];

  var recommendations = {
    foundation: {
      title: '',
      nextLine: 'До рівня Growth (2/4) залишилося всього {points} балів.',
      intro: 'Що можна зробити вже сьогодні:',
      items: [
        {
          icon: '✓',
          title: 'Замініть банер на більш якісний.',
          description: 'Наприклад, можете додати сферу вашої діяльності або щось із заголовку'
        },
        {
          icon: '✓',
          title: 'Додайте більше інформації про вас та чим ви займаєтесь в About.',
          description: 'Формула та кілька шаблонів будуть у бонусному матеаріалі нижче.'
        },
        {
          icon: '✓',
          title: 'Сформулюйте чіткий заголовок (Headline)',
          description: 'Формула та кілька шаблонів будуть у бонусному матеаріалі нижче.'
        },
        {
          icon: '→',
          title: 'Перш ніж переходити до складніших речей, рекомендуємо почати з цього матеріалу:',
          description: 'В цій статті МАКСИМАЛЬНО ДЕТАЛЬНО розписано, як саме ти можеш покращити свій профіль під свою нішу.',
          link: 'https://firstchoice.qzz.io/free/linkedin-specialist-profile-thinking/',
          linkLabel: 'ПЕРЕЙТИ'
        },
        {
          icon: '↗',
          title: 'Усе це можна зробити самостійно.',
          description: 'Але якщо ви хочете пройти цей шлях значно швидше, ми підготували покрокову систему:',
          link: 'https://secure.wayforpay.com/payment/level1.link',
          linkLabel: 'ЗАБРАТИ'
        }
      ]
    },
    growth: {
      title: '',
      nextLine: 'До рівня Professional (3/4) залишилося всього {points} балів.',
      intro: 'Що можна зробити вже сьогодні:',
      items: [
        {
          icon: '✓',
          title: 'Придумати кілька постів наперед під різні категорії',
          description: 'Формули, шаблони та 250+ тем будуть у матеріалі нижче.'
        },
        {
          icon: '✓',
          title: 'Розпочати спілкування з 5+ людьми',
          description: 'Нові коментарі, дискусії та знайомства сильно допомогають.'
        },
        {
          icon: '✓',
          title: 'Додати CTA, щоб люди відразу зрозуміли ваш запит чи цінність',
          description: 'Формула та кілька шаблонів будуть у бонусному матеріалі нижче.'
        },
        {
          icon: '→',
          title: 'Перш ніж переходити до складніших речей, рекомендуємо почати з цього матеріалу:',
          description: 'В цій статті МАКСИМАЛЬНО ДЕТАЛЬНО розписано, як саме ти можеш покращити свій профіль під свою нішу. А ТУТ підготовлені теми під твій контент.',
          links: [
            { url: 'https://firstchoice.qzz.io/free/linkedin-specialist-profile-thinking/', label: 'ПРОФІЛЬ' },
            { url: 'https://firstchoice.qzz.io/free/300-linkedin-post-ideas/', label: 'ТЕМИ' }
          ]
        },
        {
          icon: '↗',
          title: 'Усе це можна зробити самостійно.',
          description: 'Але якщо ви хочете пройти цей шлях значно швидше, ми підготували покрокову систему:',
          link: 'https://secure.wayforpay.com/payment/level2.link',
          linkLabel: 'ЗАБРАТИ'
        }
      ]
    },
    professional: {
      title: '',
      nextLine: 'До рівня Authority (4/4) залишилося всього {points} балів.',
      intro: 'Що можна зробити вже сьогодні:',
      items: [
        {
          icon: '✓',
          title: 'Підсилити контент як один з елементів воронки',
          description: 'Спробуйте експерементувати з форматами та відокремити кілька власних, які приносять найбільше результатів'
        },
        {
          icon: '✓',
          title: 'Оптимізація оферів',
          description: 'До речі, ви додали свої послуги а/або посилання на ваш лендінг?'
        },
        {
          icon: '✓',
          title: 'Лід-магніти різних форматів',
          description: 'Тут також можна погратися з форматами: автоматичні повідомлення чи залучення клієнтів через дискусії.'
        },
        {
          icon: '→',
          title: 'Перш ніж переходити до складніших речей, рекомендуємо почати з цього матеріалу:',
          description: 'В цій статті МАКСИМАЛЬНО ДЕТАЛЬНО розписано, якими форматами користувалися для достягнення 1+М переглядів.',
          link: 'https://firstchoice.qzz.io/free/one-million-views-linkedin/',
          linkLabel: 'ПЕРЕЙТИ'
        },
        {
          icon: '↗',
          title: 'Але якщо ви хочете оптимізувати та масштабувати результати, ми підготували покрокові формати, які працюють прямо зараз:',
          description: '',
          link: 'https://secure.wayforpay.com/payment/level3.link',
          linkLabel: 'ЗАБРАТИ'
        }
      ]
    },
    authority: {
      title: '',
      nextLine: 'Ви вже на рівні Authority. Наступний крок — масштабувати результат.',
      intro: 'Що можна зробити вже сьогодні?',
      items: [
        {
          icon: '✓',
          title: 'Автоматизуйте частину комунікацій',
          description: 'Частину лідгену ви можете перекинути на Sales Navigator чи referral CTA'
        },
        {
          icon: '✓',
          title: 'Створюйте складний контент (кейси/статті)',
          description: 'Тут можна зосередитись на статтях, які потрапляли би на головну сторінку'
        },
        {
          icon: '✓',
          title: 'Почніть будувати екосистему активів',
          description: 'У вашому випадку класно працювали би LinkedIn Newsletter - для глибших розборів і системної лояльності.'
        },
        {
          icon: '→',
          title: 'Перш ніж переходити до складніших речей, рекомендуємо почати з цього матеріалу:',
          description: 'В цій статті МАКСИМАЛЬНО ДЕТАЛЬНО розписані теми під екосистему активів.',
          link: 'https://firstchoice.qzz.io/free/300-linkedin-post-ideas/',
          linkLabel: 'ПЕРЕЙТИ'
        },
        {
          icon: '↗',
          title: 'Усе це можна зробити самостійно.',
          description: 'Але якщо ви хочете пройти цей шлях значно швидше, ми підготували покрокову систему:',
          link: 'https://secure.wayforpay.com/payment/level4.link',
          linkLabel: 'ЗАБРАТИ'
        }
      ]
    }
  };

  var state = {
    screen: 'intro',
    index: 0,
    answers: [],
    score: 0,
    level: levels[0]
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getLevel(score) {
    return levels.find(function (level) {
      return score >= level.min && score <= level.max;
    }) || levels[levels.length - 1];
  }

  function getPointsToNext(score, level) {
    if (!level.nextMin) return 0;
    return Math.max(0, level.nextMin - score);
  }

  function calculateScore() {
    var total = state.answers.reduce(function (sum, value) {
      return sum + Number(value || 0);
    }, 0);
    return Math.max(0, Math.min(100, Math.round(total)));
  }

  function progressPercent() {
    return Math.round((state.index / questions.length) * 100);
  }

  function setAnimatedScreen(html, focusSelector) {
    root.classList.remove('is-visible');
    window.setTimeout(function () {
      root.innerHTML = html;
      window.requestAnimationFrame(function () {
        root.classList.add('is-visible');
        if (focusSelector) {
          var focusTarget = root.querySelector(focusSelector);
          if (focusTarget) focusTarget.focus({ preventScroll: true });
        }
      });
    }, root.innerHTML ? 120 : 0);
  }

  function button(label, className, attrs) {
    return '<button class="button ' + className + ' link-ripple" type="button" ' + (attrs || '') + '>' + escapeHtml(label) + '</button>';
  }

  function renderIntro() {
    setAnimatedScreen(
      '<section class="link-assessment-card link-assessment-intro">' +
        '<p class="eyebrow">Безкоштовний інструмент</p>' +
        '<h2>LINK Score Assessment</h2>' +
        '<p>Дізнайтесь, наскільки ефективно сьогодні працює ваш LinkedIn-профіль.</p>' +
        button('Почати тест', 'primary', 'data-action="start"') +
      '</section>',
      '[data-action="start"]'
    );
  }

  function renderQuestion() {
    var question = questions[state.index];
    var percent = progressPercent();
    var answers = question.answers.map(function (answer, answerIndex) {
      return (
        '<button class="link-answer-card" type="button" data-answer="' + answerIndex + '">' +
          '<span>' + escapeHtml(answer.text) + '</span>' +
        '</button>'
      );
    }).join('');

    setAnimatedScreen(
      '<section class="link-question-panel" aria-live="polite">' +
        '<div class="link-progress-top">' +
          '<span>Питання ' + (state.index + 1) + ' із ' + questions.length + '</span>' +
          '<span>' + escapeHtml(question.axis) + '</span>' +
        '</div>' +
        '<div class="link-progress-track" aria-hidden="true"><span style="width:' + percent + '%"></span></div>' +
        '<h2>' + escapeHtml(question.title) + '</h2>' +
        (question.help ? '<p class="link-question-help">' + escapeHtml(question.help) + '</p>' : '') +
        '<div class="link-answer-grid">' + answers + '</div>' +
      '</section>',
      '[data-answer="0"]'
    );
  }

  function renderAnalyzing() {
    setAnimatedScreen(
      '<section class="link-analysis-screen" aria-live="polite">' +
        '<div class="link-loader" aria-hidden="true"></div>' +
        '<h2>Аналізуємо ваші відповіді...</h2>' +
        '<p>Збираємо ваш LINK Score, рівень і рекомендації для наступного кроку.</p>' +
      '</section>'
    );
    window.setTimeout(renderResult, ANALYSIS_DELAY);
  }

  function ringStyle(score) {
    return 'style="--score:' + score + '; --angle:' + (score * 3.6) + 'deg"';
  }

  function nextText(score, level) {
    var points = getPointsToNext(score, level);
    if (!level.next) return 'Ви вже на найвищому рівні. Наступний крок — масштабувати результат.';
    return 'До наступного рівня залишилось лише ' + points + ' балів.';
  }

  function renderResult() {
    state.score = calculateScore();
    state.level = getLevel(state.score);
    var score = state.score;
    var level = state.level;
    setAnimatedScreen(
      '<section class="link-result-card link-level-' + escapeHtml(level.id) + '">' +
        '<p class="eyebrow">Ваш результат</p>' +
        '<div class="link-score-ring" ' + ringStyle(score) + '>' +
          '<div><strong>' + score + '</strong><span>/ 100</span></div>' +
        '</div>' +
        '<h2>' + escapeHtml(level.name) + '</h2>' +
        '<p class="link-result-description">' + escapeHtml(level.description) + '</p>' +
        '<p class="link-next-points">' + escapeHtml(nextText(score, level)) + '</p>' +
        '<div class="button-row link-result-actions">' +
          button('Поділитися', 'secondary link-share-button', 'data-action="share"') +
          button('Як покращити?', 'primary', 'data-action="recommendations"') +
        '</div>' +
        '<p class="link-share-status" aria-live="polite"></p>' +
      '</section>',
      '[data-action="share"]'
    );
  }

  function recommendationLinks(item) {
    if (item.links) {
      return item.links.map(function (link) {
        return '<a class="button secondary" href="' + escapeHtml(link.url) + '">' + escapeHtml(link.label) + '</a>';
      }).join('');
    }
    if (item.link) {
      return '<a class="button secondary" href="' + escapeHtml(item.link) + '">' + escapeHtml(item.linkLabel || 'Перейти') + '</a>';
    }
    return '';
  }

  function renderRecommendations() {
    var score = state.score || calculateScore();
    var level = state.level || getLevel(score);
    var data = recommendations[level.id];
    var points = getPointsToNext(score, level);
    var cards = data.items.map(function (item) {
      return (
        '<article class="link-recommendation-card' + (item.link || item.links ? ' is-highlighted' : '') + '">' +
          '<span class="link-recommendation-icon">' + escapeHtml(item.icon) + '</span>' +
          '<div>' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
            '<div class="button-row">' + recommendationLinks(item) + '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    setAnimatedScreen(
      '<section class="link-recommendations-screen link-level-' + escapeHtml(level.id) + '">' +
        '<p class="eyebrow">Рекомендації</p>' +
        '<div class="link-recommendation-summary">' +
          '<strong>Ваш результат: ' + score + ' / 100</strong>' +
          '<span>' + escapeHtml(data.nextLine.replace('{points}', points)) + '</span>' +
        '</div>' +
        '<p class="link-recommendation-intro">' + escapeHtml(data.intro) + '</p>' +
        '<div class="link-recommendation-grid">' + cards + '</div>' +
        '<div class="button-row link-result-actions">' +
          button('Повернутися до результату', 'secondary', 'data-action="result"') +
          button('Пройти ще раз', 'primary', 'data-action="restart"') +
        '</div>' +
      '</section>',
      '[data-action="result"]'
    );
  }

  function selectAnswer(buttonEl) {
    if (!buttonEl || buttonEl.disabled) return;
    var answerIndex = Number(buttonEl.dataset.answer);
    var question = questions[state.index];
    var answer = question.answers[answerIndex];
    if (!answer) return;

    root.querySelectorAll('[data-answer]').forEach(function (buttonNode) {
      buttonNode.disabled = true;
    });

    buttonEl.classList.add('is-selected');
    state.answers[state.index] = answer.weight;

    window.setTimeout(function () {
      state.index += 1;
      if (state.index >= questions.length) {
        renderAnalyzing();
      } else {
        renderQuestion();
      }
    }, STEP_DELAY);
  }

  function shareResult() {
    var status = root.querySelector('.link-share-status');
    var url = root.dataset.shareUrl || window.location.href;
    var text = 'Чи краще твій профіль в LinkedIn за мій? Спробуй: ' + url;
    var successMessage = 'Є! Тепер можеш поділітися посиланням в коментарях чи з другом';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (status) status.textContent = successMessage;
      }).catch(function () {
        if (status) status.textContent = text;
      });
    } else if (status) {
      status.textContent = text;
    }
  }

  function createRipple(event, target) {
    var rect = target.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'link-ripple-dot';
    ripple.style.left = (event.clientX - rect.left) + 'px';
    ripple.style.top = (event.clientY - rect.top) + 'px';
    target.appendChild(ripple);
    window.setTimeout(function () {
      ripple.remove();
    }, 520);
  }

  root.addEventListener('click', function (event) {
    var rippleTarget = event.target.closest('.link-ripple');
    if (rippleTarget) createRipple(event, rippleTarget);

    var action = event.target.closest('[data-action]');
    if (action) {
      var actionName = action.dataset.action;
      if (actionName === 'start') {
        state.index = 0;
        state.answers = [];
        renderQuestion();
      }
      if (actionName === 'share') shareResult();
      if (actionName === 'recommendations') renderRecommendations();
      if (actionName === 'result') renderResult();
      if (actionName === 'restart') {
        state.index = 0;
        state.answers = [];
        state.score = 0;
        state.level = levels[0];
        renderIntro();
      }
      return;
    }

    var answer = event.target.closest('[data-answer]');
    if (answer) selectAnswer(answer);
  });

  renderIntro();
})();
