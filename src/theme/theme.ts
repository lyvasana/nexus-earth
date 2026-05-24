export const theme = {
  colors: {
    background:               '#121411',
    surfaceContainer:         '#1e201d',
    surfaceContainerHigh:     '#292b27',
    surfaceContainerHighest:  '#333532',
    surfaceContainerLow:      '#1a1c19',
    surfaceVariant:           '#333532',
    surfaceBright:            '#383a36',
    surfaceDim:               '#121411',
    onBackground:             '#e3e3de',
    onSurface:                '#e3e3de',
    onSurfaceVariant:         '#b9cacb',
    onPrimary:                '#00363a',
    leylineBlue:              '#00E0FF',
    primary:                  '#e1fdff',
    primaryContainer:         '#00f2ff',
    safeZoneEmerald:          '#10B981',
    hazardAmber:              '#F59E0B',
    machinaRed:               '#FF3B3B',
    terracottaEarth:          '#A45C40',
    deepForest:               '#2D3A2F',
    outline:                  '#849495',
    outlineVariant:           '#3a494b',
    rarity: {
      common:                 '#b9cacb',
      refined:                '#10B981',
      ornate:                 '#00E0FF',
      legendary:              '#A855F7',
      mythic:                 '#F59E0B',
    },
    node: {
      nexus:                  '#00E0FF',
      salvage:                '#A45C40',
      wilderness:             '#10B981',
      anomaly:                '#FF3B3B',
      vault:                  '#F59E0B',
    },
  },
  fonts: {
    headline: 'SpaceGrotesk',
    mono:     'JetBrainsMono',
  },
  spacing: {
    unit:           4,
    gutter:         16,
    marginMobile:   20,
    marginDesktop:  40,
    interactionMin: 50,
  },
  borderRadius: {
    sm:   2,
    md:   4,
    lg:   8,
    full: 12,
  },
};

export type Theme = typeof theme;
export type RarityTier = keyof typeof theme.colors.rarity;
export type NodeType   = keyof typeof theme.colors.node;
