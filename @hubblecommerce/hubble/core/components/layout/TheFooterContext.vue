<template>
    <div class="footer">
        <client-only>
            <div v-if="$mq === 'lg'" class="newsletter-footer-wrp">
                <newsletter />
            </div>
            <div class="main-footer-wrp">
                <the-footer-mobile v-if="$mq === 'sm' || $mq === 'md'" />
                <the-footer-desktop v-if="$mq === 'lg'" />
            </div>
        </client-only>
        <the-post-footer />
    </div>
</template>

<script>
export default {
    name: 'TheFooterContext',
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.footer {
    background-color: $white;
    width: 100%;

    .newsletter-box {
        .newsletter-headline {
            display: none;
        }

        .newsletter-subline {
            margin-bottom: 20px;
        }

        .hbl-input-group {
            margin-bottom: 0;
        }
    }

    .footer-link-wrp {
        .toggle {
            padding: 10px 20px;
            background-color: $white;
            border: 1px solid $border-color;
            text-transform: uppercase;
            text-align: left;

            &.active {
                background-color: $background-light;
            }
        }

        .collapse-wrp {
            margin-bottom: -1px;
        }

        .collapse {
            background-color: $background-light;
        }

        .content-wrp {
            padding: 20px;
        }

        .links {
            a {
                display: block;
                margin: 5px 0;
            }
        }
    }

    .logos {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: -5px;

        img {
            width: 75px;
            height: auto;
            border: 1px solid $border-color;
            margin-right: 5px;
            margin-bottom: 20px;
            margin-left: 5px;
        }
    }

    .post-footer-wrp {
        border-top: 1px solid $border-color;
    }

    .follow-us-wrp {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;

        .follow-us-icons {
            display: flex;

            img {
                width: 18px;
                margin: 0 10px;
            }
        }
    }

    .copyright-wrp {
        display: flex;
        align-items: center;
        justify-content: center;

        .copyright-text {
            text-align: center;
        }
    }

    .logo-wrp {
        height: 66px;
        padding: 20px 0;

        .logo picture img {
            width: 70px;
        }
    }
}

@media (min-width: 768px) {
    .footer {
        .newsletter-footer-wrp {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $background-light;
            padding: 60px;

            .newsletter-box {
                width: 700px;
                padding: 30px 40px;
                background-color: $white;
            }

            .newsletter-headline {
                display: block;
                margin-bottom: 10px;
            }

            .newsletter-subline {
                margin: 0;
                font-size: 16px;
            }

            .text-wrp {
                margin-bottom: 30px;
            }
        }

        .copyright-wrp {
            padding: 20px 0;
        }

        &.hubble-light {
            .footer-hint {
                padding: 0 80px;
            }
        }
    }
}

@media (min-width: 1024px) {
    .footer {
        .footer-desktop {
            padding: 40px 15px;
            display: flex;
            justify-content: space-between;

            .column {
                min-width: 250px;
                max-width: 300px;
            }

            .title {
                font-weight: $font-weight-bold;
                margin-bottom: 16px;
            }

            .links {
                a {
                    display: block;
                    font-size: 16px;
                    line-height: 32px;

                    &:hover {
                        text-decoration: none;
                    }
                }
            }
        }

        .follow-us-wrp {
            justify-content: flex-start;
            height: 100%;

            .follow-us-icons {
                &:first-child {
                    .icon {
                        margin-left: 0;
                    }
                }
            }
        }

        .logo-wrp {
            .logo {
                margin: 0 0 0 auto;
            }
        }

        .post-footer-wrp {
            margin-bottom: 140px;
        }

        &.hubble-light {
            .sub-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .copyright {
                    padding: 20px 60px 20px 100px;

                    .seal {
                        img {
                            width: 70px;
                        }
                    }
                }

                .copyright-text {
                    text-align: left;
                }

                .footer-hint {
                    margin: 0;
                    text-align: right;
                }
            }
        }
    }
}
</style>
