<template>
    <button>
        <slot />
    </button>
</template>

<script>
export default {
    name: "HblButton"
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

$button-color: $darkest-gray;
$button-background-color: $gray;
$button-border: none;
$button-border-radius: 2px;

$button-primary-color: $secondary;
$button-primary-background-color: $primary;
$button-primary-border: none;

$button-secondary-color: $primary;
$button-secondary-background-color: $secondary;
$button-secondary-border: none;

$button-font-size: 14px;
$button-font-weight: bold;
$button-text-transform: uppercase;

$button-line-height: 17px;
$button-padding: 13px 25px;

$button-icon-width: 40px;
$button-icon-height: 40px;
$button-icon-font-size: 24px;
$button-icon-padding: 10px;
$button-icon-background: transparent;
$button-icon-hover-background: transparent;
$button-icon-focus-background: transparent;

button {
    position: relative;
    overflow: hidden;
    padding: $button-padding;

    border: $button-border;
    border-radius: $button-border-radius;
    outline: none;

    text-decoration: none;
    letter-spacing: 0.4px;
    font-size: $button-font-size;
    line-height: $button-line-height;
    text-transform: $button-text-transform;
    font-weight: $button-font-weight;

    color: $button-color;
    background: $button-background-color;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:focus {
        text-decoration: none;
        outline: none;
        background: darken($button-background-color, 15%);
    }

    &:disabled,
    &[disabled] {
        opacity: 0.6;

        &:hover {
            box-shadow: none !important;
            cursor: not-allowed;
        }
    }

    &.toggle {
        width: 100%;
        height: 56px;
        border-bottom: 1px solid $border-color;

        .md-ripple {
            padding: 15px 20px;
            justify-content: left;
            .md-button-content {
                position: relative;
                z-index: 2;
                width: 100%;
                text-align: left;

                .chevron-down,
                .chevron-up {
                    margin: 0 0 0 auto;
                    position: absolute;
                    right: 0;
                    top: 3px;
                    transition: all ease-in-out 0.2s;

                    &.collapsed {
                        transform: rotate(-180deg);
                    }
                }
            }
        }
    }

    &.button-primary {
        color: $button-primary-color;
        background-color: $button-primary-background-color;
        border: $button-primary-border;

        &:focus {
            background-color: darken($button-primary-background-color, 15%);
        }

        .material-ripple__component {
            background-color: #fff;
            opacity: 0.8;
        }
    }

    &.button-secondary {
        color: $button-secondary-color;
        background-color: $button-secondary-background-color;
        border: $button-secondary-border;

        &:focus {
            background-color: darken($button-secondary-background-color, 15%);
        }

        .material-ripple__component {
            background-color: $secondary;
            opacity: 0.5;
        }
    }

    i {
        vertical-align: middle;
    }

    &.button-icon {
        min-width: $button-icon-width;
        min-height: $button-icon-height;
        padding: $button-icon-padding;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        background: $button-icon-background;

        i {
            font-size: $button-icon-font-size;
        }

        &:hover {
            background: $button-icon-hover-background;
        }

        &:focus {
            background: $button-icon-focus-background;
        }
    }
}

@media (min-width: 768px) {
    button {
        &:hover {
            text-decoration: none;
            outline: none;
            background: darken($button-background-color, 5%);
        }

        &.button-primary {
            &:hover {
                background-color: darken($button-primary-background-color, 5%);
            }
        }

        &.button-secondary {
            &:hover {
                background-color: darken($button-secondary-background-color, 5%);
            }
        }
    }
}
</style>
