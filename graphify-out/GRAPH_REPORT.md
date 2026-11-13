# Graph Report - make-no-mistakes-  (2026-11-13)

## Corpus Check
- 62 files · ~184,427 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 37, (none) 2, .kiro 1)
- WARNING: 41 of 123 files seen (33%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 685 nodes · 1346 edges · 39 communities (21 shown, 18 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5767ff25`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core.py
- validate_data.py
- DesignSystemGenerator
- design_system.py
- _domain_keywords
- search
- search_stack
- devDependencies
- compilerOptions
- CatalogRefreshTest
- cn
- types.ts
- BM25
- test_design_system_mode.py
- test_skill_script_paths.py
- RtlCliTest
- _palette_is_dark
- TestThresholdGate
- TestNativeDesktopStackFreshness
- format_ascii_box
- _normalize
- TestStackFlagWithDesignSystem
- detect_domain
- index.ts
- _contrast_ratio
- TestLightResultOutputCoherence
- _select_palette_for_mode
- _filter_anti_patterns_for_mode
- selectors.ts
- _row_identities
- dates.ts
- config.ts
- money.ts
- TestMetricMath
- CatalogSummaryLineEndingsTest
- validation.ts
- TestFixtureValidation
- TransactionRepository

## God Nodes (most connected - your core abstractions)
1. `search()` - 54 edges
2. `DesignSystemGenerator` - 38 edges
3. `search_stack()` - 36 edges
4. `cn()` - 25 edges
5. `compilerOptions` - 19 edges
6. `BM25` - 18 edges
7. `detect_domain()` - 18 edges
8. `read_rows()` - 16 edges
9. `CatalogRefreshTest` - 15 edges
10. `TestReasoningContract` - 15 edges

## Surprising Connections (you probably didn't know these)
- `TestEndToEndCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestLightResultOutputCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `TestBm25CoreBehavior` --uses--> `BM25`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_core.py → .agents/skills/ui-ux-pro-max/scripts/core.py
- `TestTokenizer` --uses--> `BM25`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_core.py → .agents/skills/ui-ux-pro-max/scripts/core.py
- `_generate_intelligent_overrides()` --calls--> `search()`  [EXTRACTED]
  .agents/skills/ui-ux-pro-max/scripts/design_system.py → .agents/skills/ui-ux-pro-max/scripts/core.py

## Import Cycles
- None detected.

## Communities (39 total, 18 thin omitted)

### Community 0 - "core.py"
Cohesion: 0.13
Nodes (10): _contains_phrase(), _exact_stack_identifier(), _passes_threshold(), _project_row(), _query_coverage(), _rewrite_query_for_domain(), _search_csv(), _search_csv_detailed() (+2 more)

### Community 1 - "validate_data.py"
Cohesion: 0.06
Nodes (43): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, TestGeneratedCatalogContract, _catalog_date(), _check_app_interface_contract() (+35 more)

### Community 2 - "DesignSystemGenerator"
Cohesion: 0.07
Nodes (9): DesignSystemGenerator, _resolve_dial(), TestReasoningMatch, read_rows(), split_values(), style_identities(), TestLandingAndStackContract, TestReasoningContract (+1 more)

### Community 3 - "design_system.py"
Cohesion: 0.05
Nodes (17): _detect_page_type(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides(), persist_design_system(), safe_slug(), _write_persisted_file(), apply_decision_rules() (+9 more)

### Community 4 - "_domain_keywords"
Cohesion: 0.22
Nodes (6): _domain_keywords(), _file_signature(), _load_csv(), _load_csv_snapshot(), _load_product_keywords(), _load_rows_or_empty()

### Community 5 - "search"
Cohesion: 0.05
Nodes (12): _normalize_rtl_level(), _rtl_row_filter(), search(), _style_search_destination(), TestDiagnosticsContracts, TestSearchDomains, TestImeGuidance, read_rows() (+4 more)

### Community 6 - "search_stack"
Cohesion: 0.16
Nodes (3): search_stack(), _rows(), TestWebStackFreshness

### Community 7 - "devDependencies"
Cohesion: 0.06
Nodes (38): devDependencies, autoprefixer@10.4.20, eslint@8.57.1, eslint-plugin-react@7.37.2, eslint-plugin-react-hooks@5.0.0, postcss@8.4.49, tailwindcss@3.4.15, @types/node@22.10.1 (+30 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+14 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (49): dependencies, clsx@2.1.1, idb@8.0.0, lucide-react@0.460.0, @radix-ui/react-alert-dialog@1.1.2, @radix-ui/react-dialog@1.1.4, react@18.3.1, react-dom@18.3.1 (+41 more)

### Community 11 - "types.ts"
Cohesion: 0.13
Nodes (15): AmountCandidate, AmountCandidateLabel, DraftAmountField, DraftFieldStatus, DraftTextField, FieldError, OcrErrorCode, OcrErrorResponse (+7 more)

### Community 13 - "BM25"
Cohesion: 0.14
Nodes (5): BM25, _get_bm25(), _suggest_identities(), TestBm25CoreBehavior, TestTokenizer

### Community 14 - "test_design_system_mode.py"
Cohesion: 0.21
Nodes (4): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

### Community 15 - "test_skill_script_paths.py"
Cohesion: 0.38
Nodes (3): resolve(), shipped_invocations(), SkillScriptPathsTest

### Community 17 - "_palette_is_dark"
Cohesion: 0.18
Nodes (4): _palette_is_dark(), _relative_luminance(), TestEndToEndCoherence, TestLuminance

### Community 20 - "format_ascii_box"
Cohesion: 0.22
Nodes (6): ansi_ljust(), format_ascii_box(), add_wrapped(), wrap_text(), hex_to_ansi(), section_header()

### Community 21 - "_normalize"
Cohesion: 0.22
Nodes (5): _exact_match_diagnostic(), _legacy_successor_guidance(), _normalize(), _stack_query_requests_legacy(), _stack_row_filter()

### Community 25 - "_contrast_ratio"
Cohesion: 0.22
Nodes (4): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), format_master_md()

### Community 26 - "TestLightResultOutputCoherence"
Cohesion: 0.24
Nodes (3): format_markdown(), _mode_support_labels(), TestLightResultOutputCoherence

### Community 29 - "selectors.ts"
Cohesion: 0.33
Nodes (3): MonthSummary, Centavos, Transaction

### Community 30 - "_row_identities"
Cohesion: 0.33
Nodes (3): _exact_row_identity(), _row_identities(), _style_identity()

## Knowledge Gaps
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `search()` connect `search` to `core.py`, `validate_data.py`, `DesignSystemGenerator`, `design_system.py`, `_domain_keywords`, `BM25`, `_normalize`, `detect_domain`, `_row_identities`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `core.py` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Why does `DesignSystemGenerator` connect `DesignSystemGenerator` to `design_system.py`, `test_design_system_mode.py`, `_palette_is_dark`, `_contrast_ratio`, `TestLightResultOutputCoherence`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `validate_data.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06116700201207243 - nodes in this community are weakly interconnected._
- **Why does `search_stack()` connect `search_stack` to `core.py`, `design_system.py`, `_domain_keywords`, `search`, `TestNativeDesktopStackFreshness`, `_normalize`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `DesignSystemGenerator` be split into smaller, more focused modules?**
  _Cohesion score 0.07088989441930618 - nodes in this community are weakly interconnected._