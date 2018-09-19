/*
 * ColoredFields
 * Free Extension
 * Copyright (c) Zinit Solutions GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

Espo.define('colored-fields:views/fields/colored-enum', 'views/fields/enum', function (Dep) {

    return Dep.extend({

        listTemplate: 'colored-fields:fields/colored-enum/detail',

        detailTemplate: 'colored-fields:fields/colored-enum/detail',

        editTemplate: 'colored-fields:fields/colored-enum/edit',

        afterRender() {
            Dep.prototype.afterRender.call(this);

            if (this.mode === 'edit') {
                this.$el.find(`select[name="${this.name}"]`).on('change', function () {
                    this.$element.css(this.getFieldStyles(this.name));
                }.bind(this));
            }
        },

        data() {
            let data = Dep.prototype.data.call(this);
            data.options = (data.params.options || []).map(item => {
                return _.extend({
                    selected: item === data.value,
                    value: item
                }, this.getFieldStyles(item));
            });
            data = _.extend(this.getFieldStyles(data.value), data);
            return data;
        },

        getFieldStyles(fieldValue) {
            let backgroundColor = this.getBackgroundColor(fieldValue);
            return {
                backgroundColor: backgroundColor,
                color: this.getFontColor(backgroundColor),
                padding: (backgroundColor === 'inherit' && this.mode !== 'edit') ? '0' : '',
                fontSize: this.model.getFieldParam(this.name, 'fontSize') || '100%',
                fontWeight: 'normal'
            };
        },

        getBackgroundColor(fieldValue) {
            let backgroundColor = (this.model.getFieldParam(this.name, 'optionColors') || {})[fieldValue];
            if (!backgroundColor) {
                return 'inherit';
            }
            return '#' + backgroundColor
        },

        getFontColor(backgroundColor) {
            let color;
            if (backgroundColor === 'inherit') {
                return '#8e8e8e';
            } else if (backgroundColor) {
                backgroundColor = backgroundColor.slice(1);
                let r = parseInt(backgroundColor.substr(0, 2), 16);
                let g = parseInt(backgroundColor.substr(2, 2), 16);
                let b = parseInt(backgroundColor.substr(4, 2), 16);
                let l = 1 - ( 0.299 * r + 0.587 * g + 0.114 * b) / 255;
                l < 0.5 ? color = '#000' : color = '#fff';
            }
            return color;
        }
    });

});
