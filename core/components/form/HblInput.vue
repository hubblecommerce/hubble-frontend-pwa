<template>
    <div class="hbl-input-group">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'hbl-input',
};
</script>

<style lang="scss">
@use 'sass:math';
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

$hbl-input-border: 1px solid $border-color;
$hbl-input-border-radius: 2px;
$hbl-input-background: $white;
$hbl-input-font-size: 16px;
$hbl-input-padding: 10px;
$hbl-input-line-height: 19px;

$hbl-input-focus-border: 1px solid $darker-gray;

$hbl-input-label-color: $text-light;
$hbl-input-label-focus-height: 14px;
$hbl-input-label-focus-font-size: 12px;
$hbl-input-label-focus-color: $text-primary;

$hbl-input-icon-size: 24px;
$hbl-input-icon-color: $text-primary;

$hbl-input-highlight-color: $primary;

/* form starting stylings ------------------------------- */
.hbl-input-group {
    position: relative;
    margin-bottom: 12px;

    input,
    textarea {
        background: $hbl-input-background;
        font-size: $hbl-input-font-size;
        padding: $hbl-input-padding;
        display: block;
        width: 100%;
        border: $hbl-input-border;
        border-radius: $hbl-input-border-radius;
        line-height: $hbl-input-line-height;

        &.invalid {
            border-color: $error-accent !important;
        }
    }

    input:focus,
    textarea:focus {
        outline: none;
        border: $hbl-input-focus-border;
    }

    /* Icons ======================================= */
    &.input-icon {
        input {
            padding-right: $hbl-input-icon-size + $hbl-input-padding * 2;
        }
    }

    .icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: $hbl-input-padding;
        width: $hbl-input-icon-size;
        height: $hbl-input-icon-size;
        font-size: $hbl-input-icon-size;
        color: $hbl-input-icon-color;
        text-align: center;
    }

    /* LABEL ======================================= */
    label {
        color: $hbl-input-label-color;
        font-size: $hbl-input-font-size;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: $hbl-input-padding;
        top: 0;
        bottom: 0;
        margin: auto;
        height: $hbl-input-line-height;
        line-height: $hbl-input-line-height;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;

        &.invalid {
            color: $error-accent !important;
        }
    }

    textarea + label {
        display: none;
    }

    /* active state */
    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
        width: auto;
        top: math.div(-$hbl-input-label-focus-height, 2);
        height: $hbl-input-label-focus-height;
        line-height: $hbl-input-label-focus-height;
        margin: 0;

        font-size: $hbl-input-label-focus-font-size;
        background: $hbl-input-background;
        color: $hbl-input-label-focus-color;
        padding: 0 5px;
    }

    /* BOTTOM BARS ================================= */
    .bar {
        position: relative;
        display: block;
        width: 100%;
    }
    .bar:before,
    .bar:after {
        content: '';
        height: 2px;
        width: 0;
        bottom: 0;
        position: absolute;
        background: $hbl-input-highlight-color;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }
    .bar:before {
        left: 50%;
    }
    .bar:after {
        right: 50%;
    }

    /* active state */
    input:focus ~ .bar:before,
    input:focus ~ .bar:after {
        width: 50%;
    }

    /* HIGHLIGHTER ================================== */
    .highlight {
        position: absolute;
        height: 60%;
        width: 100px;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
    }

    /* active state */
    input:focus ~ .highlight {
        -webkit-animation: inputHighlighter 0.3s ease;
        -moz-animation: inputHighlighter 0.3s ease;
        animation: inputHighlighter 0.3s ease;
    }

    /* ANIMATIONS ================ */
    @-webkit-keyframes inputHighlighter {
        from {
            background: $hbl-input-highlight-color;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
    @-moz-keyframes inputHighlighter {
        from {
            background: $hbl-input-highlight-color;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
    @keyframes inputHighlighter {
        from {
            background: $hbl-input-highlight-color;
        }
        to {
            width: 0;
            background: transparent;
        }
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
</style>
