import { createElement, ReactNode } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getModNode, getNode } from './helpers/node';

const always = (variant: boolean): () => boolean => () => variant;

describe('Replace:', () => {
    it('allows to replace self', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public render() {
                return 'Replaced with text';
            }
        }
        expect(getNode(createElement(MyBlock)).html()).toBe('');
        expect(getNode(createElement(MyBlock)).text()).toBe('Replaced with text');
    });

    it('allows rewrite replace in modifier', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public render(): ReactNode {
                return 'Replaced with text';
            }
        }

        class BlockMod extends MyBlock {
            public static mod = always(true);
            public render() {
                return createElement('span', {
                    children: super.render() + ' with mod content'
                });
            }
        }

        const B = withMods(MyBlock, BlockMod);

        expect(getModNode(createElement(B)).name()).toBe('span');
        expect(getModNode(createElement(B)).text()).toBe('Replaced with text with mod content');
    });

    it('allows rewrite replace in modifier', () => {
        class MyBlock<P> extends Block<P> {
            public block = 'MyBlock';
            public content() {
                return 'default content';
            }
        }

        interface IMProps {
            b?: boolean;
        }

        class BlockMod extends MyBlock<IMProps> {
            public static mod = (props: IMProps) => Boolean(props.b);
            public render() {
                return createElement('span', {
                    children: 'replaced content'
                });
            }
        }

        const B = withMods(MyBlock, BlockMod);

        expect(getModNode(createElement(B)).text()).toBe('default content');
        expect(getModNode(createElement(B, { b: true })).text()).toBe('replaced content');
    });
});
