import React, { useEffect, useState, useCallback } from 'react';
import {
    Modal,
    Group,
    Select,
    Button,
    SimpleGrid,
    Text,
    Stack,
    Box,
    Paper,
    Tooltip,
    Flex,
    Menu,
    SegmentedControl
} from '@mantine/core';
import { IconTrash, IconRefresh, IconEdit, IconChevronRight } from '@tabler/icons-react';
import { useCardStore } from '../modules/state/store.ts';
import { Game } from '../modules/balatrots/Game.ts';
import { Deck, deckMap } from '../modules/balatrots/enum/Deck.ts';
import { Stake, stakeMap } from '../modules/balatrots/enum/Stake.ts';
import { InstanceParams } from '../modules/balatrots/struct/InstanceParams.ts';
import { convertGameCardToDeckCard, type DeckCard } from '../modules/deckUtils.ts';
import { Card, PlayingCard } from '../modules/balatrots/enum/cards/Card.ts';
import { EditionItem, Edition } from '../modules/balatrots/enum/Edition.ts';
import { SealItem, Seal } from '../modules/balatrots/enum/Seal.ts';

function SimCard({ card, selected, onClick, onUpdate, onRemove }: {
    card: DeckCard,
    selected: boolean,
    onClick: () => void,
    onUpdate: (id: string, updates: Partial<DeckCard>) => void,
    onRemove: (id: string) => void
}) {
    const suitColors: Record<string, string> = {
        Hearts: '#e03131',
        Diamonds: '#e03131',
        Clubs: '#1c1c1c',
        Spades: '#1c1c1c',
    };

    const suitSymbols: Record<string, string> = {
        Hearts: '♥',
        Diamonds: '♦',
        Clubs: '♣',
        Spades: '♠',
    };

    const hasModifiers =
        (card.edition && card.edition !== 'No Edition') ||
        (card.enhancement && card.enhancement !== 'No Enhancement') ||
        (card.seal && card.seal !== 'No Seal');

    // Context menu items
    const renderMenu = () => (
        <Menu.Dropdown>
            <Menu.Label>修改卡牌</Menu.Label>

            <Menu shadow="md" width={200} trigger="hover" position="right-start">
                <Menu.Target>
                    <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                        增强
                    </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                    {[['No Enhancement', '无增强'], ['Bonus Card', '奖励牌'], ['Mult Card', '倍率牌'], ['Wild Card', '万能牌'], ['Glass Card', '玻璃牌'], ['Steel Card', '钢铁牌'], ['Stone Card', '石头牌'], ['Gold Card', '黄金牌'], ['Lucky Card', '幸运牌']].map(([value, label]) => (
                        <Menu.Item key={value} onClick={(e) => { e.stopPropagation(); onUpdate(card.id, { enhancement: value }); }}>
                            {label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={200} trigger="hover" position="right-start">
                <Menu.Target>
                    <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                        版本
                    </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                    {[['No Edition', '无版本'], ['Foil', '闪箔'], ['Holographic', '镭射'], ['Polychrome', '多彩'], ['Negative', '负片']].map(([value, label]) => (
                        <Menu.Item key={value} onClick={(e) => { e.stopPropagation(); onUpdate(card.id, { edition: value }); }}>
                            {label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={200} trigger="hover" position="right-start">
                <Menu.Target>
                    <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                        蜡封
                    </Menu.Item>
                </Menu.Target>
                <Menu.Dropdown>
                    {[['No Seal', '无蜡封'], ['Red Seal', '红色蜡封'], ['Blue Seal', '蓝色蜡封'], ['Gold Seal', '金色蜡封'], ['Purple Seal', '紫色蜡封']].map(([value, label]) => (
                        <Menu.Item key={value} onClick={(e) => { e.stopPropagation(); onUpdate(card.id, { seal: value }); }}>
                            {label}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>

            <Menu.Divider />
            <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={(e) => { e.stopPropagation(); onClick(); onRemove(card.id); }}
            >
                移除卡牌
            </Menu.Item>
        </Menu.Dropdown>
    );

    return (
        <Menu shadow="md" width={200} position="bottom-start" withArrow trigger="hover" openDelay={200}>
            <Menu.Target>
                <Paper
                    withBorder
                    p={4}
                    onClick={onClick}
                    style={{
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: selected ? '#e7f5ff' : (hasModifiers ? 'rgba(255, 255, 255)' : undefined),
                        borderColor: selected ? '#339af0' : undefined,
                        borderWidth: selected ? 2 : 1,
                        transition: 'transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Tooltip
                        label={
                            <Stack gap={2}>
                                <Text size="sm" fw={600}>{card.name}</Text>
                                {card.edition && card.edition !== 'No Edition' && (
                                    <Text size="xs">版本: {card.edition}</Text>
                                )}
                                {card.enhancement && card.enhancement !== 'No Enhancement' && (
                                    <Text size="xs">增强: {card.enhancement}</Text>
                                )}
                                {card.seal && card.seal !== 'No Seal' && (
                                    <Text size="xs">蜡封: {card.seal}</Text>
                                )}
                            </Stack>
                        }
                    >
                        <Flex align="center" justify="center" gap={2} bg='white'>
                            <Text
                                size="sm"
                                fw={700}
                                c={suitColors[card.suit]}
                            >
                                {card.rank === '10' ? '10' : card.rank[0]}
                            </Text>
                            <Text size="sm" c={suitColors[card.suit]}>
                                {suitSymbols[card.suit]}
                            </Text>
                        </Flex>
                    </Tooltip>
                    {hasModifiers && !selected && (
                        <Box
                            style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: 'gold',
                            }}
                        />
                    )}
                </Paper>
            </Menu.Target>
            {renderMenu()}
        </Menu>
    );
}

export function DrawSimulatorModal() {
    const opened = useCardStore(state => state.applicationState.drawSimulatorModalOpen);
    const close = useCardStore(state => state.closeDrawSimulatorModal);
    const updateCardInDeck = useCardStore(state => state.updateCardInDeck);
    const removeCardFromDeck = useCardStore(state => state.removeCardFromDeck);

    // Global App State for defaults
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);

    // Game State Inputs
    const seed = useCardStore(state => state.immolateState.seed);
    const deckType = useCardStore(state => state.immolateState.deck);
    const stake = useCardStore(state => state.immolateState.stake);
    const gameVersion = useCardStore(state => state.immolateState.gameVersion);
    const showmanOwned = useCardStore(state => state.immolateState.showmanOwned);
    const customDeck = useCardStore(state => state.deckState.cards);

    // Simulation State
    const [ante, setAnte] = useState<string>('1');
    const [blind, setBlind] = useState<string>('1'); // 1=Small, 2=Big, 3=Boss
    const [fullShuffledDeck, setFullShuffledDeck] = useState<DeckCard[]>([]);
    const [hand, setHand] = useState<DeckCard[]>([]);
    const [deckPointer, setDeckPointer] = useState<number>(0);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [handSize, setHandSize] = useState<number>(8);
    const [discardsUsed, setDiscardsUsed] = useState<number>(0);
    const [sortMode, setSortMode] = useState<string>('rank');

    // Helper to sort cards
    const sortCards = useCallback((cards: DeckCard[], mode: string) => {
        const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
        const rankOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

        return [...cards].sort((a, b) => {
            if (mode === 'suit') {
                if (a.suit !== b.suit) return suits.indexOf(a.suit) - suits.indexOf(b.suit);
                const aRank = a.rank === '10' ? '10' : a.rank[0];
                const bRank = b.rank === '10' ? '10' : b.rank[0];
                return rankOrder.indexOf(aRank) - rankOrder.indexOf(bRank);
            } else {
                const aRank = a.rank === '10' ? '10' : a.rank[0];
                const bRank = b.rank === '10' ? '10' : b.rank[0];
                if (aRank !== bRank) return rankOrder.indexOf(aRank) - rankOrder.indexOf(bRank);
                return suits.indexOf(a.suit) - suits.indexOf(b.suit);
            }
        });
    }, []);

    // Re-sort hand when sortMode changes
    useEffect(() => {
        setHand(prev => sortCards(prev, sortMode));
    }, [sortMode, sortCards]);

    // Sync state and simulate when opening
    useEffect(() => {
        if (opened) {
            const blindMap: Record<string, string> = {
                'smallBlind': '1',
                'bigBlind': '2',
                'bossBlind': '3'
            };
            const initialAnte = selectedAnte.toString();
            const initialBlind = blindMap[selectedBlind] || '1';

            setAnte(initialAnte);
            setBlind(initialBlind);

            // Pass values directly because state updates are async
            simulate(initialAnte, initialBlind);
        }
    }, [opened, selectedAnte, selectedBlind]);

    const simulate = (overrideAnte?: string, overrideBlind?: string) => {
        if (!seed) return;

        const currentAnte = overrideAnte || ante;
        const currentBlind = overrideBlind || blind;

        // 1. Instantiate Game
        const d = new Deck(deckMap[deckType] || deckMap['Red Deck']);
        const s = new Stake(stakeMap[stake || 'White Stake']);
        const v = Number(gameVersion || '10106');
        const params = new InstanceParams(d, s, showmanOwned, v);
        const engine = new Game(seed, params);

        // 2. Inject Custom Deck
        if (customDeck && customDeck.length > 0) {
            const convertedCards = customDeck.map((dc) => {
                // Fix enhancement name mismatch
                let enhancement = dc.enhancement;
                if (enhancement && enhancement.endsWith(" Card")) {
                    enhancement = enhancement.replace(" Card", "");
                }
                const baseName = typeof dc.base === 'string' ? dc.base : (Array.isArray(dc.base) ? (dc.base as any).join('') : String(dc.base || ''));
                const newCard = new Card(
                    baseName as PlayingCard,
                    enhancement,
                    new EditionItem(dc.edition as Edition),
                    new SealItem(dc.seal as Seal)
                );
                // Attach original ID to the game engine's card object
                (newCard as any).originalId = dc.id;
                return newCard;
            });
            engine.setCustomDeck(convertedCards);
        }

        // 3. Shuffle
        const anteNum = parseInt(currentAnte);
        const blindNum = parseInt(currentBlind);
        const shuffled = engine.getShuffledDeck(anteNum, blindNum);

        // Convert to DeckCard, restoring original IDs where applicable
        const shuffledDeckCards = shuffled.map((c, i) => {
            const dc = convertGameCardToDeckCard(c, i);
            if ((c as any).originalId) {
                dc.id = (c as any).originalId;
            }
            return dc;
        });

        setFullShuffledDeck(shuffledDeckCards);

        // 4. Draw Initial Hand
        const initialHand = shuffledDeckCards.slice(0, handSize);
        setHand(sortCards(initialHand, sortMode)); // Auto-sort
        setDeckPointer(handSize);
        setSelectedCards([]);
        setDiscardsUsed(0);
    };

    // Auto-simulate when critical params change while modal is open
    useEffect(() => {
        if (opened) {
            simulate();
        }
    }, [handSize, customDeck]); // Re-simulate if hand size or deck composition changes

    const toggleSelection = (id: string) => {
        if (selectedCards.includes(id)) {
            setSelectedCards(selectedCards.filter(cid => cid !== id));
        } else if (selectedCards.length < 5) {
            setSelectedCards([...selectedCards, id]);
        }
    };

    const discard = () => {
        if (selectedCards.length === 0) return;

        // Remove selected cards from hand
        const remainingHand = hand.filter(c => !selectedCards.includes(c.id));

        // Draw replacements
        const numToDraw = selectedCards.length;
        const newCards = fullShuffledDeck.slice(deckPointer, deckPointer + numToDraw);

        setHand(sortCards([...remainingHand, ...newCards], sortMode)); // Auto-sort
        setDeckPointer(deckPointer + numToDraw);
        setSelectedCards([]);
        setDiscardsUsed(prev => prev + 1);
    };

    const handleCardUpdate = (id: string, updates: Partial<DeckCard>) => {
        // 1. Update Global Store (persists to deck)
        updateCardInDeck(id, updates);

        // 2. Update Local State (hand and fullDeck) so UI reflects changes immediately
        setHand(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        setFullShuffledDeck(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleCardRemove = (id: string) => {
        // 1. Update Global Store
        removeCardFromDeck(id);

        // 2. Update Local State
        setHand(prev => prev.filter(c => c.id !== id));
        setFullShuffledDeck(prev => prev.filter(c => c.id !== id));
        setSelectedCards(prev => prev.filter(cid => cid !== id));
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="抽牌模拟器"
            size="lg"
            centered
        >
            <Stack>
                <Group align="flex-end">
                    <Select
                        label="底注"
                        data={Array.from({ length: 8 }, (_, i) => (i + 1).toString())}
                        value={ante}
                        onChange={(val) => val && setAnte(val)}
                        w={80}
                    />
                    <Select
                        label="盲注"
                        data={[
                            { value: '1', label: '小盲注' },
                            { value: '2', label: '大盲注' },
                            { value: '3', label: 'Boss盲注' }
                        ]}
                        value={blind}
                        onChange={(val) => val && setBlind(val)}
                    />
                    <Select
                        label="手牌上限"
                        data={['5', '6', '7', '8', '9', '10']}
                        value={handSize.toString()}
                        onChange={(val) => val && setHandSize(parseInt(val))}
                        w={80}
                    />
                    <Button onClick={() => simulate()} leftSection={<IconRefresh size={16} />}>
                        模拟 / 重置
                    </Button>
                </Group>

                <Paper withBorder p="md" bg="gray.1">
                    <Group justify="space-between" mb="xs">
                        <Text fw={600}>手牌 ({hand.length})</Text>
                        <SegmentedControl
                            size="xs"
                            value={sortMode}
                            onChange={(val) => setSortMode(val)}
                            data={[
                                { label: '点数', value: 'rank' },
                                { label: '花色', value: 'suit' }
                            ]}
                        />
                    </Group>

                    {hand.length > 0 ? (
                        <SimpleGrid cols={8} spacing="xs" verticalSpacing="xs">
                            {hand.map(card => (
                                <SimCard
                                    key={card.id}
                                    card={card}
                                    selected={selectedCards.includes(card.id)}
                                    onClick={() => toggleSelection(card.id)}
                                    onUpdate={handleCardUpdate}
                                    onRemove={handleCardRemove}
                                />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">手牌为空</Text>
                    )}
                </Paper>

                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        牌组剩余卡牌: {fullShuffledDeck.length - deckPointer}
                    </Text>
                    <Group>
                        <Text size="sm">已使用弃牌: {discardsUsed}</Text>
                        <Button
                            color="red"
                            variant="light"
                            leftSection={<IconTrash size={16} />}
                            disabled={selectedCards.length === 0}
                            onClick={discard}
                        >
                            弃掉选中 ({selectedCards.length})
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
}
