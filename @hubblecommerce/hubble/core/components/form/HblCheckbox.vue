<template>
    <div class="hbl-checkbox">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'HblCheckbox',
};
</script>

<style lang="scss">
@use 'sass:math';
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

/*
Checkbox example:
<div class="hbl-checkbox">
    <input id="checkboxId" type="checkbox" checked>
    <label for="checkboxId">Item 1</label>
</div>
*/

$hbl-checkbox-checked-color: $darker-gray;
$hbl-checkbox-checked-border-color: $darker-gray;
$hbl-checkbox-unchecked-border-color: #e2e2e2;
$hbl-checkbox-border-color-disabled: $gray;
$hbl-checkbox-checked-color-disabled: $gray;
$hbl-checkbox-background-color: $white;

$hbl-checkbox-size: 20px;
$hbl-checkbox-icon-size: 15px;
$hbl-checkbox-margin-bottom: 15px;
$hbl-checkbox-border-width: 1px;
$hbl-checkbox-border-radius: 4px;
$hbl-checkmark-width: 12px;
$hbl-checkbox-label-padding: 10px;
$hbl-checkmark-color: $white;
$hbl-checkbox-label-font-size: 14px;
$hbl-checkbox-line-height: 17px;

// inside of radiobox
$hbl-radiobox-gap-size: 3px;

$hbl-radiobox-inner-position-left: $hbl-radiobox-gap-size + $hbl-checkbox-border-width;
$hbl-radiobox-inner-width: $hbl-checkbox-size - ($hbl-checkbox-border-width * 2) - ($hbl-radiobox-gap-size * 2);

.hbl-checkbox {
    position: relative;
    text-align: left;
    margin-bottom: $hbl-checkbox-margin-bottom;

    &.hbl-checkbox-inline {
        display: inline-block;
    }

    label {
        cursor: pointer;
        display: inline-block;
        line-height: $hbl-checkbox-line-height;
        vertical-align: top;
        clear: both;
        padding-left: 1px;
        position: relative;
        margin: 0;
        font-size: $hbl-checkbox-label-font-size;

        &:not(:empty) {
            padding-left: $hbl-checkbox-size + $hbl-checkbox-label-padding;
        }

        &:before,
        .icon {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
        }

        &:before {
            // box
            width: $hbl-checkbox-size;
            height: $hbl-checkbox-size;
            background: $hbl-checkbox-background-color;
            border: $hbl-checkbox-border-width solid $hbl-checkbox-unchecked-border-color;
            box-sizing: border-box;
            border-radius: $hbl-checkbox-border-radius;
            cursor: pointer;
            transition: background 0.3s;
        }

        .icon{
            width: $hbl-checkbox-icon-size;
            height: $hbl-checkbox-icon-size;
            left: 2px;
            transform: scale(0);
            transition: transform .1s;

            svg path {
                fill: white;
            }
        }
    }

    input[type='radio'],
    input[type='checkbox'] {
        outline: 0;
        visibility: hidden;
        width: 0;
        margin: 0;
        display: block;
        float: left;
        font-size: inherit;
    }

    input[type='checkbox'] {
        &:checked {
            + label:before {
                background: $hbl-checkbox-checked-color;
                border: $hbl-checkbox-border-width solid $hbl-checkbox-checked-border-color;
            }
            + label .icon {
                transform: scale(1);
            }
        }

        &:disabled {
            + label:before {
                border-color: $hbl-checkbox-border-color-disabled;
            }
            &:checked {
                + label:before {
                    background: $hbl-checkbox-checked-color-disabled;
                }
            }
        }
    }

    input[type='radio'] {
        &:checked,
        &:not(:checked) {
            + label:before {
                border-radius: 100%;
            }
        }

        &:checked,
        &:not(:checked) {
            + label:after {
                content: '';
                background: $hbl-checkbox-checked-color;
                position: absolute;
                width: $hbl-radiobox-inner-width;
                height: $hbl-radiobox-inner-width;
                left: $hbl-radiobox-inner-position-left;
                border-radius: 100%;
                transition: all 0.3s ease;
                opacity: 0;
                top: 50%;
                margin-top: math.div(-$hbl-radiobox-inner-width, 2);
                transform: scale(0);
            }
        }

        &:checked {
            + label:before {
                border: $hbl-checkbox-border-width solid $hbl-checkbox-checked-border-color;
                border-radius: 100%;
            }
            + label:after {
                opacity: 1;
                transform: scale(1);
            }
        }

        &:disabled {
            + label:before {
                border-color: $hbl-checkbox-border-color-disabled;
            }
            &:checked,
            &:not(:checked) {
                + label:after {
                    background: $hbl-checkbox-checked-color-disabled;
                }
            }
        }
    }
}
</style>
