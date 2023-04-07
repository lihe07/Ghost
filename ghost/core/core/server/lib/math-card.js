const {renderToString} = require('katex');

module.exports = {
    name: 'math',
    type: 'dom',
    config: {
        commentWrapper: true
    },

    render: function ({payload, env: {dom}}) {
        let html = renderToString(payload.math || '', {
            throwOnError: false, displayMode: true
        });

        if (!html) {
            return dom.createTextNode('');
        }

        return dom.createRawHTMLSection(html);
    }
};
