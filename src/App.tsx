import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import { MantineProvider, Paper, Space, Stack, Text, Title } from "@mantine/core";
import { Blueprint } from "./components/blueprint/standardView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SeedResultProvider } from "./modules/state/analysisResultProvider.tsx";
import { SeedOptionsProvider } from "./modules/state/optionsProvider.tsx";
import { DownloadSeedResultProvider } from "./modules/state/downloadProvider.tsx";
import { BlueprintThemeProvider, useBlueprintTheme } from "./modules/state/themeProvider.tsx";
import { NextStepProvider, NextStepReact, type Tour, type Step } from 'nextstepjs';
import { useCardStore } from "./modules/state/store.ts";
const queryClient = new QueryClient()

const steps: Array<Tour> = [
    {
        tour: 'onboarding-tour',
        steps: [
            {
                title: "欢迎使用 Blueprint！",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>
                            为更精明的 Balatro 科学家提供更多功能
                        </Text>
                        <Text>
                            - Balatro University
                        </Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#view-mode',
                title: "视图模式",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>
                            允许您切换应用的外观。
                        </Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'bottom'
            },
            {
                selector: '#seed-config',
                title: "种子配置",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>
                            在此输入种子并选择起始牌组、注数和游戏版本。
                        </Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#setting-max-ante',
                title: "精细控制",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>控制 Blueprint 分析种子的底注数量。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#analyze-button',
                title: "运行分析",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>开始分析！</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#ante-navigation',
                title: "浏览底注",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>浏览每个底注。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#blind-navigation',
                title: "盲注选择",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>在小盲注、大盲注和Boss盲注之间切换，查看商店内容。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'bottom'
            },
            {
                selector: '#shop-results',
                title: "商店与补充包",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>查看商店和补充包中确切会出现哪些小丑牌、塔罗牌和星球牌。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-sources',
                title: "卡牌来源",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>来源标签显示每个卡牌来源的详细分类：优惠券、标签、Boss、甚至命运之轮的结果！</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-purchases',
                title: "购买记录",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>跟踪您在分析中"购买"的每张卡牌，用于规划种子路线。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-deck',
                title: "您的牌组",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>查看当前牌组状态。您甚至可以手动修改卡牌或克隆它们来模拟特定场景！</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#simulate-draw-button',
                title: "手牌模拟器",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>
                            如果您购买标准牌、从牌组中移除卡牌，Blueprint 会跟踪一切并可以显示您的抽牌。
                        </Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-events',
                title: "事件追踪",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>解锁事件驱动的小丑牌，使其能正确出现在商店中。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#features-button',
                title: "功能展示",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>展示应用的一些功能。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '[data-tour-id="features-modal"]',
                title: "种子概要",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>种子的快速概要和您可以找到的卡牌</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left-top'
            },
            {
                title: "重掷计算器",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>计算在商店队列中到达某张卡牌所需的费用。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                title: "快速重掷",
                icon: "",
                content: (
                    <Stack gap="xs">
                        <Text>快速重掷商店中的卡牌。只需长按卡牌即可。</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            }
        ]
    }
]



function ProviderContainer({ children }: { children: React.ReactNode }) {
    const { theme, themes } = useBlueprintTheme()
    const settingsOpen = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);
    const asideOpen = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    const setAsideTab = useCardStore(state => state.setAsideTab);
    const openSnapshotModal = useCardStore(state => state.openSnapshotModal);
    const closeSnapshotModal = useCardStore(state => state.closeSnapshotModal);
    const openRerollModal = useCardStore(state => state.openRerollCalculatorModal);
    const closeRerollModal = useCardStore(state => state.closeRerollCalculatorModal);

    const handleStepChange = (step: number) => {
        // Steps 1-4: Settings (Navbar) open
        if (step >= 1 && step <= 4) {
            if (!settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Steps 5-7: Main View (No side panels needed)
        if (step >= 5 && step <= 7) {
            if (settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Steps 8-12: Aside Panel features
        if (step >= 8 && step <= 12) {
            if (!asideOpen) toggleOutput();
            if (settingsOpen) toggleSettings();
        }

        // Steps 13-15: Extra Tools (Navbar)
        if (step >= 13 && step <= 15) {
            if (!settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Specific Tab Switching
        if (step === 8) setAsideTab('sources');
        if (step === 9) setAsideTab('purchases');
        if (step === 10 || step === 11) setAsideTab('deck');
        if (step === 12) setAsideTab('events');

        // Modal Triggers
        if (step === 14) {
            openSnapshotModal();
        }
        if (step === 15) {
            closeSnapshotModal();
        }
        if (step === 16) {
            openRerollModal({});
        }
        if (step === 17) {
            closeRerollModal();
        }
    }

    return (

        <MantineProvider defaultColorScheme={'dark'} theme={themes[theme]}>
            <QueryClientProvider client={queryClient}>
                <SeedOptionsProvider>
                    <SeedResultProvider>
                        <DownloadSeedResultProvider>
                            <NextStepProvider>
                                <NextStepReact
                                    steps={steps}
                                    onStepChange={handleStepChange}>
                                    {children}
                                </NextStepReact>
                            </NextStepProvider>
                        </DownloadSeedResultProvider>
                    </SeedResultProvider>
                </SeedOptionsProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}

export default function App() {
    return (
        <BlueprintThemeProvider>
            <ProviderContainer>
                <Blueprint />
                <Space my={'xl'} />
            </ProviderContainer>
        </BlueprintThemeProvider>
    );
}
