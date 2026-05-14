import {
    IconEye,
    IconGauge,
    IconList,
    IconMessage2,
    IconShoppingCart,
    IconUser
} from '@tabler/icons-react';
import {Container, Paper, SimpleGrid, Space, Stack, Text, ThemeIcon, Title} from '@mantine/core';
import React from "react";
import {QuickAnalyze} from "../../SeedInputAutoComplete.tsx";
import classes from './Homepage.module.css';
import HeroClasses from "./Hero.module.css"
import type {
    Icon,
    IconProps} from '@tabler/icons-react';
import { translateGameName } from '../../../modules/i18n/gameTranslations.ts';

export const Features = [
    {
        icon: IconGauge,
        title: '准确性',
        description:
            'Blueprint 使用 Immolate 来分析 Balatro 种子，而非自研方案，从而提供更准确的结果和更可靠的体验',
    },
    {
        icon: IconUser,
        title: '个性化体验',
        description:
            '您可以自定义查看种子信息的方式，无论只想看到基本内容还是想查看所有信息',
    },
    {
        icon: IconEye,
        title: '卡牌剧透',
        description:
            `您可以选择查看${translateGameName("The Soul")}、${translateGameName("Judgement")}、${translateGameName("Wraith")}等卡牌会给予您什么`,
    },
    {
        icon: IconShoppingCart,
        title: '卡牌购买',
        description:
            '您可以在商店中购买卡牌和优惠券，生成购物清单，并更准确地了解您运行中将出现的内容',
    },
    {
        icon: IconList,
        title: '深入分析',
        description:
            `应用支持查看商店以外的多个来源的卡牌，包括${translateGameName("Uncommon Tag")}、${translateGameName("8 Ball")}、${translateGameName("Purple Seal")}等`,
    },
    {
        icon: IconMessage2,
        title: '社区',
        description:
            'Balatro Discord 是一个非常有帮助的地方，您可以在那里报告错误或寻求帮助。我也欢迎建议和反馈。',
    },
];

interface FeatureProps {
    icon:  React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    title: React.ReactNode;
    description: React.ReactNode;
}

export function Feature({icon: Icon, title, description}: FeatureProps) {
    return (
        <Paper withBorder p={'1rem'} shadow={'lg'}>
            <ThemeIcon variant="light" size={40} radius={40}>
                <Icon size={18} stroke={1.5}/>
            </ThemeIcon>
            <Text mt="sm" mb={7}>
                {title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
                {description}
            </Text>
        </Paper>
    );
}

function HeroText() {
    return (
        <Container fluid mb={'xl'}>
            <div className={HeroClasses.inner}>
                <Title className={HeroClasses.title}>
                    现代化界面中的全功能{' '}
                    <Text component="span" className={HeroClasses.highlight} inherit>
                        种子路由和分析
                    </Text>
                </Title>

                <Container p={0} size={600}>
                    <Text size="lg" c="dimmed" className={HeroClasses.description}>
                        Blueprint 是一个免费开源的 Balatro 种子分析和路由工具，旨在帮助玩家优化种子路由。与游戏或其开发者无关。
                    </Text>
                </Container>

                <div className={HeroClasses.controls}>
                    <Stack gap={'sm'}>
                        <QuickAnalyze/>
                        <Text ta={'right'} fz={'sm'} c={'dimmed'}>
                            想要搜索种子？试试 {" "}
                            <Text
                                component={'a'}
                                fz={'sm'}
                                style={{ textDecoration: 'underline'}}
                                href={'https://github.com/OptimusPi/MotelyJAML/releases/tag/v1.0.0'}
                            >
                                MotelyJAML
                            </Text>
                            {" "}by pifreak
                        </Text>
                    </Stack>

                </div>

            </div>
        </Container>
    );
}

export function FeaturesGrid() {
    const features = Features.map((feature, index) => <Feature {...feature} key={index}/>);

    return (
        <Container className={classes.wrapper}>
            <HeroText/>
            <Space my={'xl'}/>
            <Paper p={'2rem'}>
                <SimpleGrid
                    mt={60}
                    cols={{base: 1, sm: 2, md: 3}}
                    spacing={{base: 'xl', md: 50}}
                    verticalSpacing={{base: 'xl', md: 50}}
                >
                    {features}
                </SimpleGrid>
            </Paper>
        </Container>
    );
}


export default function HomePage() {
    return (
        <Container fluid>
            <FeaturesGrid/>
        </Container>
    )
}
