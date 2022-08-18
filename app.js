const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const ONLY_NUMBER_REGEX = /^\d+$/;

Array.from($$('.mat-tab-group')).forEach((root, rootIndex) => {
  let id = root.id;
  if (!id || id === '') {
    console.error(
      `Reuquired id at 'mat-tab-group' class. Ex: <div class="mat-tab-group id="tab1">...</div>.
        Exceptions below ELement: 
      `,
      root
    );
    throw new Error('Please provide an id.');
  }
  id = `_${id}`;
  root.id = id;
  const inkBar = $(`#${id} .mat-ink-bar`);
  const tabList = $$(`#${id} .mat-tab-item`);
  const arrayTabList = Array.from(tabList);
  const tabActiveIndex = root.getAttribute('tabActiveIndex');
  const tabBodyNodes = $(`#${id} .tab-translate`);
  const tabBodyItemNode =  $$(`#${id} .tab-body-content`);
  const arrayTabBodyItemList = Array.from(tabBodyItemNode);

  if(arrayTabList.length < 2) {
    console.error(`When use Tabs view, you must provide more than one tab item, Exceptions at:
    `, root);
    return;
  }

  let tabActive = 0;
  if (!tabActiveIndex) {
    console.warn(
      ` It looks like you haven't provided tabActiveIndex yet, so tabActiveIndex will be set by 0 as default.
  This below element is not set tabActiveIndex: 
`, root)
    tabActive = 0;
  } else {
    const matching = ONLY_NUMBER_REGEX.test(tabActiveIndex);
    if (matching) {
      tabActive = +tabActiveIndex;
    } else {
      const more = tabList.length > 1 ? 's' : '';
      console.warn(
        `Invalid tabActiveIndex, you have ${tabList.length} tab item${more}, active index will be from 0 -> ${tabList.length - 1}.
  Because of that, 0 is set as default.`, root);
    }
  }
  const setStyleForInkBar = ({ left, width }) => {
    inkBar.style.width = width + 'px';
    inkBar.style.left = left + 'px';
  };
  const setActiveDefault = (order) => {
    inkBar.style.width = tabList[order].getBoundingClientRect().width + 'px';
    inkBar.style.left = arrayTabList[order].offsetLeft + 'px';
    arrayTabList[order].classList.add('active');
    const offsetLeft = arrayTabBodyItemList[order].offsetLeft;
    tabBodyNodes.style.transform = `translateX(-${offsetLeft}px)`;
    const tTransition = setTimeout(() => {
      tabBodyNodes.style.transition = `.3s`;
      clearTimeout(tTransition);
    }, 500);

  };
  setActiveDefault(tabActive);
  let previosTabIndex = tabActive;
  const onTabChange = (parentId, tabId, tabName) => {
    const translateSpacing = arrayTabBodyItemList[tabActive].getBoundingClientRect().width * tabId;
    let translateParam = '';
    translateParam = `-${translateSpacing}px`;
    tabBodyNodes.style.transform = `translateX(${translateParam})`;
    previosTabIndex = tabId;
  }

  arrayTabList.forEach((el, index) => {
    el.addEventListener('click', () => {
      arrayTabList.forEach((e) => {
        if (e.classList.contains('active')) {
          e.classList.remove('active');
        }
      });
      el.classList.add('active');
      setStyleForInkBar({
        left: tabList[index].offsetLeft,
        width: tabList[index].getBoundingClientRect().width,
      });
      onTabChange(id, index, el.textContent);
    });
  });
});


