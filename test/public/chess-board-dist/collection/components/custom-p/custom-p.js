export class CustomParagraph {
    render() {
        return (h("p", { style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            } },
            h("slot", null)));
    }
    static get is() { return "custom-p"; }
}
