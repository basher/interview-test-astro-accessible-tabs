class Tabs {
    private tabComponent: Element;
    private tabpanels: NodeListOf<HTMLElement>;
    private tabTriggers: NodeListOf<HTMLElement>;
    private toggleClassname: string;

    constructor(tabComponent: Element) {
        this.tabComponent = tabComponent;
        this.tabpanels = this.tabComponent.querySelectorAll('[data-tabpanel]');
        this.tabTriggers = this.tabComponent.querySelectorAll('[data-tab]');
        this.toggleClassname = 'u-hidden';

        this.init();
    }

    public static start(): void {
        const tabComponents = document.querySelectorAll('[data-module="tabs"]');

        tabComponents.forEach((tabComponent) => {
            const instance = new Tabs(tabComponent);
            return instance;
        });
    }

    private init(): void {
        this.createTabs();
    }

    private createTabs(): void {
        // Hide all tabpanels initially.
        this.tabpanels.forEach((tabpanel) => {
            tabpanel.classList.add(this.toggleClassname);
        });

        // Create tablist and tab "buttons".
        const tablist = document.createElement('div');
        tablist?.setAttribute('role', 'tablist');
        tablist?.classList.add('tabs__tablist');

        this.tabComponent.insertBefore(tablist, this.tabpanels[0]);

        this.tabTriggers.forEach((tabTrigger, index) => {
            const tabButton = document.createElement('button');
            tabButton.setAttribute('id', `${tabTrigger.id}-trigger`);
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-selected', 'false');
            tabButton.setAttribute('tabIndex', '-1');
            tabButton.setAttribute('aria-controls', tabTrigger.id);
            tabButton.classList.add('tabs__link');
            tabButton.innerHTML = tabTrigger.innerHTML;

            tablist.appendChild(tabButton);

            // Make 1st tab "active" by default.
            if (index === 0) {
                tabButton.setAttribute('aria-selected', 'true');
                tabButton.setAttribute('tabIndex', '0');
            }

            // Event listeners.
            tabButton.addEventListener('click', (e: MouseEvent) => {
                this.bindClickEvent(e);
            });
            tabButton.addEventListener('keydown', (e: KeyboardEvent) => {
                this.bindKeyboardEvent(e, index);
            });
        });

        // Update tabpanel properties.
        this.tabpanels.forEach((tabpanel, index) => {
            const tabpanelId = this.tabTriggers[index].id;

            tabpanel.setAttribute('id', tabpanelId);
            tabpanel.setAttribute('role', 'tabpanel');
            tabpanel.setAttribute(
                'aria-labelledby',
                `${tabpanelId}-trigger`,
            );
            tabpanel.setAttribute('tabIndex', '0');

            // Remove original headings (i.e. with "data-tab" attribute) so we don't get duplicate IDs on the page.
            this.tabTriggers[index].remove();

            // Show 1st tabpanel by default.
            if (index === 0) {
                tabpanel.classList.remove(this.toggleClassname);
            }
        });
    }

    private bindClickEvent(e: MouseEvent): void {
        e.preventDefault();
        const trigger = e.currentTarget as HTMLElement;
        const triggerId = trigger.id.substring(0, trigger.id.indexOf('-trigger'));
        const tabButtons = this.tabComponent.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;

        // Hide all tabpanels.
        this.tabpanels.forEach((tabpanel) => {
            tabpanel.classList.add(this.toggleClassname);
        });

        // Update clicked tab and related tabpanel properties.
        tabButtons.forEach((tabButton) => {
            tabButton.setAttribute('aria-selected', 'false');
            tabButton.setAttribute('tabIndex', '-1');
        });
        this.tabpanels.forEach((tabpanel) => {
            if (tabpanel.id === triggerId) {
                tabpanel.classList.remove(this.toggleClassname);
            }
        });
        trigger?.setAttribute('aria-selected', 'true');
        trigger?.setAttribute('tabIndex', '0');
    }

    private bindKeyboardEvent(e: KeyboardEvent, index: number): void {
        const tabButtons = this.tabComponent.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>;

        // Stop page jumping with certain key events with 'e.preventDefault()'.
        switch (e.code) {
            case 'ArrowRight':
                e.preventDefault();
                if (tabButtons.length - index > 1) {
                    tabButtons[index + 1].focus();
                    tabButtons[index + 1].click();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (index > 0) {
                    tabButtons[index - 1].focus();
                    tabButtons[index - 1].click();
                }
                break;
            case 'Home':
                e.preventDefault();
                if (index !== 0) {
                    tabButtons[0].focus();
                    tabButtons[0].click();
                }
                break;
            case 'End':
                e.preventDefault();
                if (index !== tabButtons.length - 1) {
                    tabButtons[this.tabTriggers.length - 1].focus();
                    tabButtons[this.tabTriggers.length - 1].click();
                }
                break;
            default:
                break;
        }
    }
}
export default Tabs;
