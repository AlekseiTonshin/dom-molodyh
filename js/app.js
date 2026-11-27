const FORM_URL = 'https://forms.yandex.ru/u/6ad9cb5b95add5d1b4c4c88f';

const $ = (sel) => document.querySelector(sel);
const home = $('#screen-home');
const formScreen = $('#screen-form');
const frame = $('#form-frame');

// 1. Сообщаем ВКонтакте, что приложение запустилось (обязательно).
//    Вне ВК (при проверке с компьютера) вызов тихо завершится ошибкой — это нормально.
try {
  vkBridge.send('VKWebAppInit').catch(() => {});
} catch (e) {
  console.warn('VK Bridge недоступен (приложение открыто вне ВКонтакте)');
}

// 2. Рисуем карточки пространств
$('#spaces').innerHTML = SPACES.map((s) => `
  <article class="card">
    <div class="card__img" ${s.image ? `style="background-image:url('${s.image}')"` : ''}></div>
    <div class="card__body">
      <h3>${s.name}</h3>
      <p>${s.description}</p>
      <p><strong>${s.capacity}</strong></p>
      <div class="tags">${(s.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      <button class="btn" data-open-form data-space="${s.name}">Забронировать</button>
    </div>
  </article>
`).join('');

// 3. Переключение экранов
function openForm(spaceName) {
  const chosen = $('#chosen');
  if (spaceName) {
    chosen.textContent = 'Вы выбрали: ' + spaceName + '. Укажите это пространство в форме.';
    chosen.hidden = false;
  } else {
    chosen.hidden = true;
  }
  if (!frame.src) frame.src = FORM_URL + '?iframe=1'; // форма грузится при первом открытии
  home.hidden = true;
  formScreen.hidden = false;
  window.scrollTo(0, 0);
}

function closeForm() {
  formScreen.hidden = true;
  home.hidden = false;
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open-form]');
  if (btn) openForm(btn.dataset.space || '');
});
$('#back').addEventListener('click', closeForm);

// 4. Запасная ссылка «Открыть в браузере»
$('#form-link').addEventListener('click', (e) => {
  e.preventDefault();
  try {
    vkBridge.send('VKWebAppOpenLink', { url: FORM_URL }).catch(() => window.open(FORM_URL, '_blank'));
  } catch (err) {
    window.open(FORM_URL, '_blank');
  }
});
