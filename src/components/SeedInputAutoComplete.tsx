import React, {useState, useRef} from "react";
import { Autocomplete, Button, Group, NativeSelect, Paper } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import {popularSeeds, SeedsWithLegendary} from "../modules/const.ts";
import {useCardStore} from "../modules/state/store.ts";
import {sanitizeSeed} from "../modules/utils.ts";
import { deckNames } from "../modules/i18n/gameTranslations.ts";

const seedAutoCompleteData = [
    {
        group: '热门种子',
        items: popularSeeds
    }, {
        group: '包含传说小丑的种子',
        items: SeedsWithLegendary
    }
];

const allSuggestions = [...popularSeeds, ...SeedsWithLegendary];

interface SeedInputProps {
    seed: string;
    setSeed: (seed: string) => void;
    w?: number | string;
    showDeckSelect?: boolean;
    label?: string;
    placeholder?: string;
}

function SeedInputAutoComplete({ seed, setSeed, w, showDeckSelect, label = '种子', placeholder = '输入种子' }: SeedInputProps) {
    const [localSeed, setLocalSeed] = useState(seed);
    const isDirty = useRef(false);

    // Sync from store when not actively editing
    if (!isDirty.current && localSeed !== seed) {
        setLocalSeed(seed);
    }

    const debouncedSetSeed = useDebouncedCallback((value: string) => {
        setLocalSeed(sanitizeSeed(value));
        if (value) setSeed(value);
        isDirty.current = false;
    }, 160);

    const deck = useCardStore(state => state.immolateState.deck);
    const setDeck = useCardStore(state => state.setDeck);

    const sectionWidth = 130;
    const deckSelect = showDeckSelect ? (
        <NativeSelect
            rightSectionWidth={28}
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: sectionWidth,
                    marginRight: -2,
                },
            }}
            value={deck}
            onChange={(e) => setDeck(e.currentTarget.value)}
        >
            {Object.entries(deckNames).map(([en, zh]) => (
                <option key={en} value={en}>{zh}</option>
            ))}
        </NativeSelect>
    ) : undefined;

    return (
        <Autocomplete
            flex={1}
            w={w}
            type="text"
            label={label}
            placeholder={placeholder}
            data={seedAutoCompleteData}
            value={localSeed}
            onChange={(value) => {
                isDirty.current = true;
                setLocalSeed(value);
                if (allSuggestions.includes(value)) {
                    setSeed(value);
                    isDirty.current = false;
                } else {
                    debouncedSetSeed(value);
                }
            }}
            rightSection={deckSelect}
            rightSectionWidth={showDeckSelect ? sectionWidth : undefined}
        />
    );
}

export function QuickAnalyze() {
    const seed = useCardStore(state => state.immolateState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const setStart = useCardStore(state => state.setStart);

    return (
        <Paper withBorder shadow={'lg'} p={'1rem'} radius={'md'}>
            <Group align={'flex-end'}>
                <SeedInputAutoComplete
                    seed={seed}
                    setSeed={setSeed}
                    w={500}
                    showDeckSelect
                    label="分析种子"
                />
                <Button onClick={() => {
                    setStart(seed.length > 0);
                }}> 分析种子 </Button>
            </Group>
        </Paper>
    );
}

export default SeedInputAutoComplete;