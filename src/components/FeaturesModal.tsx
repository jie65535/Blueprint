import React from "react";
import { useCardStore } from "../modules/state/store.ts";
import { Accordion, Container, Modal, Text, Stack, List } from "@mantine/core";
import { IconCalculator, IconCards, IconLock, IconCamera, IconRefresh, IconEye } from "@tabler/icons-react";
import { translateGameName } from "../modules/i18n/gameTranslations.ts";

export default function FeaturesModal() {
    const featuresModalOpen = useCardStore(state => state.applicationState.featuresModalOpen);
    const closeFeaturesModal = useCardStore(state => state.closeFeaturesModal);

    if (!featuresModalOpen) return null;

    return (
        <Modal
            size="lg"
            title="Blueprint 功能"
            opened={featuresModalOpen}
            onClose={() => closeFeaturesModal()}
        >
            <Container fluid data-tour-id="features-modal">
                <Accordion variant="separated" defaultValue={null}>
                    <Accordion.Item value="reroll-calculator">
                        <Accordion.Control icon={<IconCalculator size={20} />}>
                            <Text fw={600}>重掷计算器</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        计算在商店队列中到达某张卡牌所需的费用。例如，如果您的蓝图在第40个位置，
                                        它将计算您需要花费多少钱才能到达那张卡牌。它还会考虑已购买的会影响重掷的优惠券。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>在商店队列中，将鼠标悬停在卡牌上，会出现一个"购买"按钮</List.Item>
                                        <List.Item>点击下拉箭头并选择"重掷计算器"</List.Item>
                                        <List.Item>
                                            如果您已经进行了部分回合并重掷了一些卡牌，
                                            在重掷计算器按钮下方有一个"标记为起始点"的按钮。
                                        </List.Item>
                                        <List.Item>计算器将从您选择的起始点或队列开头开始计算费用</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="misc-cards">
                        <Accordion.Control icon={<IconCards size={20} />}>
                            <Text fw={600}>杂项卡牌队列面板</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        显示来自秘术包、天体包、标准包和其他补充包等各种来源的卡牌队列。
                                        在打开之前就能看到您会获得什么卡牌。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>点击汉堡菜单（☰）打开侧面板</List.Item>
                                        <List.Item>导航到"卡牌来源"标签页</List.Item>
                                        <List.Item>从那里点击您想查看的队列即可</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="unlock-events">
                        <Accordion.Control icon={<IconLock size={20} />}>
                            <Text fw={600}>解锁事件卡牌</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        在游戏中，许多卡牌只有在完成某些操作后才会出现。
                                        例如，只有获得钢铁牌后才能获得{translateGameName("Steel Joker")}。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>点击汉堡菜单（☰）打开侧面板</List.Item>
                                        <List.Item>导航到"事件"标签页</List.Item>
                                        <List.Item>标记您已完成的事件以及完成的时间。</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="seed-snapshot">
                        <Accordion.Control icon={<IconCamera size={20} />}>
                            <Text fw={600}>种子快照</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        创建种子的高级概览，快速显示：
                                        - 种子中的优惠券
                                        - 种子中的Boss
                                        - 种子中可以找到的小丑牌。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>在设置导航栏中点击"快照"按钮</List.Item>
                                        <List.Item>一个模态框将显示在您的屏幕上。</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="quick-reroll">
                        <Accordion.Control icon={<IconRefresh size={20} />}>
                            <Text fw={600}>快速重掷</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        启用快速交互来重掷商店队列中的单张卡牌。
                                        长按任意卡牌即可立即重掷并查看下一张卡牌，
                                        无需在之前的底注中找到该卡牌并购买。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>在设置导航栏中启用"快速重掷"开关</List.Item>
                                        <List.Item>导航到蓝图视图中的任意商店队列</List.Item>
                                        <List.Item>长按（点击并按住）任意卡牌</List.Item>
                                        <List.Item>卡牌将被重掷并显示下一个选项</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="joker-spoilers">
                        <Accordion.Control icon={<IconEye size={20} />}>
                            <Text fw={600}>小丑牌剧透</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>功能说明：</Text>
                                    <Text size="sm" c="dimmed">
                                        将给予小丑牌的卡牌（如{translateGameName("Judgement")}、{translateGameName("Wraith")}、{translateGameName("The Soul")}）替换为它们实际会提供的小丑牌。
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>如何找到/使用：</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>在设置导航栏中切换"显示小丑牌剧透"开关</List.Item>
                                        <List.Item>商店和补充包中的卡牌将显示实际的小丑牌</List.Item>
                                        <List.Item>关闭开关可查看原始卡牌（您在游戏中看到的）</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </Modal>
    );
}
