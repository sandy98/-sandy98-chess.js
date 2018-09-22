export class ContextMenu {
    constructor() {
        this.items = 1;
        this.x = 0;
        this.y = 0;
        this.menuDisplay = 'none';
        this.ovlBg = 'transparent';
        this.header = '';
        this.footer = '';
    }
    render() {
        const availWidth = screen['availWidth'];
        const availHeight = screen['availHeight'];
        const arrItems = [...new Array(this.items)].map((_, i) => i);
        console.log(arrItems);
        const overlayStyle = {
            display: this.menuDisplay,
            position: 'absolute',
            top: '0',
            left: '0',
            width: `${availWidth * 0.99}px`,
            height: `${availHeight * 0.82}px`,
            minWidth: `${availWidth * 0.99}px`,
            minHeight: `${availHeight * 0.82}px`,
            maxWidth: `${availWidth * 0.99}px`,
            maxHeight: `${availHeight * 0.82}px`,
            background: this.ovlBg,
            opacity: '1',
            zIndex: '10'
        };
        const menuStyle = {
            display: 'flex',
            flexDirection: 'column',
            justyfyContent: 'flex-start',
            position: 'relative',
            left: `${this.x}px`,
            top: `${this.y}px`,
            paddingLeft: '1em',
            minWidth: '10em',
            maxWidth: '20%',
            minHeight: '3em',
            //maxHeight: '12em',
            overFlowY: 'auto',
            color: 'black',
            background: 'white',
            border: 'solid 1px black',
            borderRadius: '5px',
            mozBoxShadowBottom: '10px 10px 10px black',
            webkitBoxShadowBottom: '10px 10px 10px black',
            boxShadowBottom: '10px 10px 10px black',
            opacity: '1',
        };
        const tasksStyle = {
            listStyle: 'none',
            margin: '0',
            padding: '0'
        };
        const taskStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: 'solid 1px #dfdfdf'
        };
        return (h("div", { ref: (el) => this['overlay'] = el, style: Object.assign({}, overlayStyle), onClick: () => {
                this.closeMenu.emit();
            } },
            h("div", { style: Object.assign({}, menuStyle), onClick: (e) => {
                    e.cancelBubble = true;
                } },
                h("div", { style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        padding: '0.5em'
                    } },
                    h("h3", null, this.header),
                    h("div", { title: "Close", style: {
                            cursor: 'pointer',
                            textAlign: 'center',
                            color: 'white',
                            padding: '0.2em',
                            background: 'red',
                            border: 'none',
                            borderRadius: '50%',
                            fontWeight: 'bolder',
                            fontSize: '1em',
                            width: '1.2em',
                            height: '1.2em'
                        }, onClick: () => {
                            this.closeMenu.emit();
                        } }, "X")),
                h("ul", { style: Object.assign({}, tasksStyle) }, arrItems.map(n => {
                    return (h("li", { style: Object.assign({}, taskStyle), key: n },
                        h("slot", { name: n.toString() })));
                })))));
    }
    static get is() { return "context-menu"; }
    static get properties() { return {
        "footer": {
            "type": String,
            "attr": "footer"
        },
        "header": {
            "type": String,
            "attr": "header"
        },
        "items": {
            "type": Number,
            "attr": "items"
        },
        "menuDisplay": {
            "type": String,
            "attr": "menu-display"
        },
        "ovlBg": {
            "type": String,
            "attr": "ovl-bg"
        },
        "x": {
            "type": Number,
            "attr": "x"
        },
        "y": {
            "type": Number,
            "attr": "y"
        }
    }; }
    static get events() { return [{
            "name": "closeMenu",
            "method": "closeMenu",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
}
