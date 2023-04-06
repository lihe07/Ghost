import Component from '@ember/component';
import classic from 'ember-classic-decorator';
import {action, computed, set} from '@ember/object';
import {isBlank} from '@ember/utils';
import {renderToString} from 'katex';
import {run} from '@ember/runloop';

@classic
export default class KoenigCardMath extends Component {
    // attrs
    payload = null;
    isSelected = false;
    isEditing = false;
    headerOffset = 0;

    // closure actions
    selectCard() {}
    deselectCard() {}
    editCard() {}
    saveCard() {}
    deleteCard() {}
    registerComponent() {}

    @computed('payload.math')
    get isEmpty() {
        return isBlank(this.payload.math);
    }

    @computed('payload.math')
    get counts() {
        // Math expressions count for no words
        return {
            wordCount: 0,
            imageCount: 0
        };
    }

    @computed('payload.math')
    get rendered() {
        try {
            return renderToString(this.payload.math, {displayMode: true});
        } catch (e) {
            return e;
        }
    }

    @computed('isEditing')
    get toolbar() {
        if (this.isEditing) {
            return false;
        }

        return {
            items: [{
                buttonClass: 'fw4 flex items-center white',
                icon: 'koenig/kg-edit',
                iconClass: 'fill-white',
                title: 'Edit',
                text: '',
                action: run.bind(this, this.editCard)
            }]
        };
    }

    init() {
        super.init(...arguments);
        let payload = this.payload || {};

        // CodeMirror errors on a `null` or `undefined` value
        if (!payload.math) {
            set(payload, 'math', '');
        }

        this.set('payload', payload);

        this.registerComponent(this);
    }

    @action
    updateMath(math) {
        this._updatePayloadAttr('math', math);
    }

    @action
    leaveEditMode() {
        if (this.isEmpty) {
            // afterRender is required to avoid double modification of `isSelected`
            // TODO: see if there's a way to avoid afterRender
            run.scheduleOnce('afterReamnder', this, this.deleteCard);
        }
    }

    _updatePayloadAttr(attr, value) {
        let payload = this.payload;
        let save = this.saveCard;

        set(payload, attr, value);

        // update the mobiledoc and stay in edit mode
        save(payload, false);
    }
}
