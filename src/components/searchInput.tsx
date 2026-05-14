import React, {useCallback, useMemo, useState} from "react";
import {Spotlight, closeSpotlight, openSpotlight} from "@mantine/spotlight";
import {
    ActionIcon,
    Checkbox,
    CheckboxGroup,
    Divider,
    Group,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget,
    SimpleGrid,
    TextInput
} from "@mantine/core";
import {IconSearch, IconSettings} from "@tabler/icons-react";
import {useSetState} from "@mantine/hooks";
import {getMiscCardSources} from "../modules/ImmolateWrapper";
import {LOCATIONS} from "../modules/const.ts";
import {useCardStore} from "../modules/state/store.ts";
import {GaEvent} from "../modules/useGA.ts";
import {useSeedResultsContainer} from "../modules/state/analysisResultProvider.tsx";
import type {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import type {Ante} from "../modules/ImmolateWrapper/CardEngines/Cards.ts";
import { translateGameName, blindTypeNames } from "../modules/i18n/gameTranslations.ts";

const registeredMiscSources = getMiscCardSources(15).map(source => source.name)
export default function SearchSeedInput() {
    const SeedResults = useSeedResultsContainer();
    const searchString = useCardStore(state => state.searchState.searchTerm);
    const setSearchString = useCardStore(state => state.setSearchString);
    const goToResults = useCardStore(state => state.setSelectedSearchResult);
    const [searchActive, setSearchActive] = useState(false);
    const handleSearch = useCallback(() => {
        setSearchActive(true)
        openSpotlight()
    }, []);
    type sources = 'shop' | 'packs' | 'misc';
    type filterConfig = { enabled: boolean, children?: { [key: string]: filterConfig } };
    type sourceFilterConfig = {
        [key in sources]: filterConfig;
    };
    const [sourceFilterConfig, setSourceFilterConfig] = useSetState<sourceFilterConfig>({
        shop: {
            enabled: true
        },
        packs: {
            enabled: true
        },
        misc: {
            enabled: true,
            children: registeredMiscSources.reduce((acc, curr) => ({...acc, [curr]: {enabled: true}}), {} as {
                [key: string]: filterConfig
            })
        }
    });

    const updateSourceFilter = useCallback((parent: string, enabled?: boolean, child?: string, childEnabled?: boolean) => {
        if (!child) {
            const current = sourceFilterConfig[parent as sources];
            setSourceFilterConfig({[parent]: {...current, enabled: enabled ?? true}});
        } else {
            const current = sourceFilterConfig[parent as sources];
            if (current.children) {
                setSourceFilterConfig({
                    [parent]: {
                        enabled: current.enabled,
                        children: {
                            ...current.children,
                            [child]: {enabled: childEnabled ?? true}
                        }
                    }
                })
            }
        }
    }, [sourceFilterConfig, setSourceFilterConfig]);


    const matchesSearch = (card: any, searchString: string): boolean => {
        const lower = searchString.toLowerCase();
        const name = card.name ?? '';
        const translatedName = translateGameName(name);
        // Match against original name, translated name, edition, type
        const searchFields = [
            name,
            translatedName,
            card.edition ?? '',
            translateGameName(card.edition ?? ''),
            card.type ?? '',
            translateGameName(card.type ?? ''),
        ].map(s => s.toLowerCase());
        return searchFields.some(f => f.includes(lower));
    };

    const searchResults = useMemo(() => {
        if (searchString === '' || !searchActive) return [];
        const cards: Array<BuyMetaData> = [];
        const antes: Array<Ante> = Object.values(SeedResults?.antes ?? {});
        antes.forEach((ante: Ante) => {
            ante.queue.forEach((card, index) => {
                if (matchesSearch(card, searchString)) {
                    cards.push({
                        transactionType: "buy",
                        // @ts-ignore I didn't do a great job typing cards throughout the project
                        card: card,
                        location: LOCATIONS.SHOP,
                        locationType: LOCATIONS.SHOP,
                        ante: String(ante.ante),
                        name: card.name,
                        index: index,
                        blind: 'smallBlind'
                    })
                }
            })
            const blinds = Object.keys(ante.blinds) as Array<keyof typeof ante.blinds>;
            blinds
                .forEach((blind) => {
                // @ts-ignore I didn't do a great job typing cards throughout the project
                ante.blinds[blind]?.packs?.forEach((pack) => {
                    // @ts-ignore I didn't do a great job typing cards throughout the project
                    pack.cards.forEach((card, index) => {
                        if(!card) return;
                        if (matchesSearch(card, searchString)) {
                            cards.push({
                                transactionType: "buy",
                                card: card,
                                location: pack.name,
                                locationType: LOCATIONS.PACK,
                                ante: String(ante.ante),
                                name: card.name,
                                index: index,
                                blind: blind
                            })
                        }
                    })
                })
            })
            Object.values(ante.miscCardSources).forEach((source) => {
                source.cards.forEach((card, index) => {
                    if (matchesSearch(card, searchString)) {
                        cards.push({
                            transactionType: "buy",
                            card: card,
                            location: source.name,
                            locationType: LOCATIONS.MISC,
                            ante: String(ante.ante),
                            name: card.name,
                            index: index,
                            blind: 'smallBlind'
                        })
                    }
                })
            });
        })
        return cards.filter((card) => {
            const locationType = card.locationType;
            const location = card.location;
            if (locationType === LOCATIONS.SHOP) {
                return sourceFilterConfig.shop.enabled;
            }
            if (locationType === LOCATIONS.PACK) {
                return sourceFilterConfig.packs.enabled;
            }
            if (locationType === LOCATIONS.MISC) {
                const miscConfig = sourceFilterConfig.misc;
                if (miscConfig.enabled) {
                    const childConfig = miscConfig.children || {};
                    return childConfig[location].enabled;
                }
                return false;
            }
            return false;
        })
    }, [searchString, searchActive, SeedResults?.antes, sourceFilterConfig.shop.enabled, sourceFilterConfig.packs.enabled, sourceFilterConfig.misc])
    return (
        <>
            <Spotlight
                nothingFound={searchString.length > 0 ? `
                    未找到结果。如果您搜索的卡牌在游戏中是解锁的（如${translateGameName("Eris")}或${translateGameName("Lucky Cat")}），请确保您在事件标签页中启用了该卡牌。（右侧的汉堡菜单）
                `: '开始输入以搜索卡牌'}
                highlightQuery
                scrollable
                maxHeight={'80vh'}
                actions={
                    searchResults
                        .map((result: any, index) => {
                            const card = result.card;
                            const edition = card?.edition && card.edition !== 'No Edition' ? translateGameName(card.edition) : '';
                            const cardName = translateGameName(card?.name ?? '');
                            const label = edition ? `${edition} ${cardName}` : cardName;

                            const locationType = result?.locationType;

                            let description = '';
                            if (locationType === LOCATIONS.SHOP) {
                                description += `底注 ${result.ante} 商店：卡牌 ${result.index + 1}`;
                            }
                            if (locationType === LOCATIONS.PACK) {
                                description += `底注 ${result.ante} 盲注：${blindTypeNames[result.blind] ?? result.blind} ${translateGameName(result.location)}`;
                            }
                            if (locationType === LOCATIONS.MISC) {
                                description += `底注 ${result.ante} ${translateGameName(result.location)}：卡牌 ${result.index + 1}`;
                            }

                            return {
                                id: String(index),
                                label,
                                description,
                                group: result.locationType === LOCATIONS.SHOP ? '商店' : translateGameName(result.location),
                                onClick: () => {
                                    closeSpotlight()
                                    goToResults(result)
                                }
                            }
                        }
                    )
                }
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        const query = e.currentTarget.value;
                        setSearchActive(query !== '')
                        setSearchString(query)
                    },
                }}
            />
            <Group align={'flex-end'}>
                <TextInput
                    flex={1}
                    placeholder={'搜索卡牌'}
                    onClick={()=>{
                        GaEvent('search_bar_clicked')
                        openSpotlight()
                    }}
                    leftSection={
                        // <ActionIcon>
                        <HoverCard>
                            <HoverCardTarget>
                                <IconSettings/>
                            </HoverCardTarget>
                            <HoverCardDropdown>
                                <CheckboxGroup
                                    label={'搜索筛选'}
                                    description={'选择要包含在搜索中的来源'}
                                    mb={'sm'}
                                    value={
                                    ['shop', 'packs', 'misc'].filter(source => sourceFilterConfig?.[source as sources]?.enabled)
                                    }
                                    onChange={(e:Array<string>) => {
                                        const sources = Object.keys(sourceFilterConfig) as Array<sources>;
                                        for ( const source of sources ) {
                                            if(e.includes(source) && !sourceFilterConfig[source].enabled) {
                                                updateSourceFilter(source, true);
                                                return;
                                            } else if (!e.includes(source) && sourceFilterConfig[source].enabled) {
                                                updateSourceFilter(source, false);
                                                return;
                                            }
                                        }
                                        console.log("no changes detected", e);
                                    }}
                                >
                                    <Group mt={'sm'}>
                                        <Checkbox value="shop" label='商店'/>
                                        <Checkbox value='packs' label='补充包' />
                                        <Checkbox value='misc' label='杂项' />
                                    </Group>
                                </CheckboxGroup>
                                <Divider my={'md'} label={'杂项来源'} />
                                <SimpleGrid cols={{ sm: 2, md: 3}}>
                                    {sourceFilterConfig.misc.enabled &&
                                        Object.keys(sourceFilterConfig.misc.children || {}).map((child) => (
                                            <Checkbox
                                                key={child}
                                                label={translateGameName(child)}
                                                value={child}
                                                checked={sourceFilterConfig.misc.children ? sourceFilterConfig.misc.children[child]?.enabled : false}
                                                onChange={(e) => {
                                                    updateSourceFilter('misc', true, child, e.currentTarget.checked)
                                                }}
                                            />
                                        ))
                                    }
                                </SimpleGrid>
                            </HoverCardDropdown>
                        </HoverCard>

                        // </ActionIcon>
                    }
                    rightSection={
                        <ActionIcon onClick={handleSearch}>
                            <IconSearch/>
                        </ActionIcon>
                    }
                />
            </Group>

        </>

    )
}
