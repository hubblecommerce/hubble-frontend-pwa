<template>
    <div class="hbl-select">
        <slot />
    </div>
</template>

<script>
export default {
    name: "HblSelect"
}
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

/*
<div class="hbl-select">
    <select class="select-text" required>
        <option value="" disabled selected></option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
    </select>
    <span class="select-highlight"></span>
    <span class="select-bar"></span>
    <label class="select-label">Select</label>
</div>
*/

$hbl-select-height: 42px;
$hbl-select-height-md: 42px;

$hbl-select-background-color: $white;
$hbl-select-border: 1px solid $border-color;

$hbl-select-font-size: 16px;
$hbl-select-label-color: $text-primary;
$hbl-select-label-height: 17px;

$hbl-select-hover-border: 1px solid $darker-gray;

.hbl-select {
    position: relative;
    display: inline-block;
    width: 100%;
    height: $hbl-select-height;
    margin-bottom: 20px;
    background: $hbl-select-background-color;

    &:after {
        content: '\e93f';
        font-family: 'icons';
        font-size: 22px;
        color: $hbl-select-label-color;

        position: absolute;
        right: 0;
        top: 0;
        width: $hbl-select-height;
        height: $hbl-select-height;
        line-height: $hbl-select-height;
        text-align: center;
        z-index: 0;
        border-left: $hbl-select-border;
    }

    .select-text {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        position: relative;
        font-family: inherit;
        background-color: transparent;
        width: 100%;
        height: 100%;
        padding: 4px 5px 5px 9px;
        font-size: $hbl-select-font-size;
        border-radius: 0;
        border: $hbl-select-border;
        z-index: 10;
        cursor: pointer;
        line-height: $hbl-select-label-height;

        &.invalid {
            border: 1px solid $error-accent;
        }
    }

    /* Remove focus */
    .select-text:focus {
        outline: none;
    }

    /* LABEL ======================================= */
    .select-label {
        color: $hbl-select-label-color;
        font-size: $hbl-select-font-size;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 12px;
        top: 0;
        bottom: 0;
        margin: auto;
        transition: 0.2s ease all;
        line-height: $hbl-select-label-height;
        height: $hbl-select-label-height;
    }

    .select-text:valid ~ .select-label {
        display: none;
    }

    .select-text:valid {
        outline: none;
        box-shadow: none;
    }

    .select-text:invalid {
        outline: none;
        box-shadow: none;
    }

    .select-text:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    /* BOTTOM BARS ================================= */
    .select-bar {
        position: relative;
        display: block;
        width: 100%;
    }

    .select-bar:before,
    .select-bar:after {
        content: '';
        height: 2px;
        width: 0;
        bottom: 1px;
        position: absolute;
        background: $primary;
        transition: 0.2s ease all;
    }

    .select-bar:before {
        left: 50%;
    }

    .select-bar:after {
        right: 50%;
    }

    /* active state */
    .select-text:focus ~ .select-bar:before,
    .select-text:focus ~ .select-bar:after {
        width: 50%;
    }

    /* HIGHLIGHTER ================================== */
    .select-highlight {
        position: absolute;
        height: 60%;
        width: 100%;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
    }

    .validation-msg {
        position: absolute;
        margin: 5px;
        width: 100%;
        font-size: 12px;
        color: $error-accent;
        line-height: 12px;
    }
}

@media (min-width: 768px) {
    .hbl-select {
        height: $hbl-select-height-md;

        &:after {
            height: $hbl-select-height-md;
            line-height: $hbl-select-height-md;
        }

        &:hover {
            &:after {
                border-left: $hbl-select-hover-border;
            }

            .select-text {
                border: $hbl-select-hover-border;
            }
        }
    }
}
</style>
