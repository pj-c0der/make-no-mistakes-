# Graph Report - make-no-mistakes-  (2026-11-13)

## Corpus Check
- 53 files · ~181,277 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 41 file(s) not represented in the graph (top: .csv 37, (none) 2, .kiro 1)
- WARNING: 41 of 114 files seen (36%) have no supported extractor and are missing from this graph entirely. It may look complete while representing only part of the codebase.

## Summary
- 629 nodes · 1273 edges · 26 communities (15 shown, 11 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9389dee5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- format_ascii_box
- validate_data.py
- DesignSystemGenerator
- design_system.py
- _select_palette_for_mode
- search
- search_stack
- package.json
- compilerOptions
- CatalogRefreshTest
- cn
- TestLightResultOutputCoherence
- core.py
- test_skill_script_paths.py
- RtlCliTest
- _select_palette_for_mode
- TestThresholdGate
- CatalogSummaryLineEndingsTest
- TestStackFlagWithDesignSystem
- detect_domain
- _contrast_ratio
- test_design_system_mode.py
- _filter_anti_patterns_for_mode
- TestMetricMath
- TestFixtureValidation

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

## Communities (26 total, 11 thin omitted)

### Community 0 - "format_ascii_box"
Cohesion: 0.22
Nodes (6): ansi_ljust(), format_ascii_box(), add_wrapped(), wrap_text(), hex_to_ansi(), section_header()

### Community 1 - "validate_data.py"
Cohesion: 0.07
Nodes (43): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, _catalog_date(), _check_app_interface_contract(), _check_catalog_contract() (+35 more)

### Community 2 - "DesignSystemGenerator"
Cohesion: 0.05
Nodes (14): DesignSystemGenerator, _resolve_dial(), apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), _validate_action(), TestReasoningMatch, read_rows() (+6 more)

### Community 3 - "design_system.py"
Cohesion: 0.06
Nodes (12): _detect_page_type(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides(), persist_design_system(), safe_slug(), _write_persisted_file(), format_output() (+4 more)

### Community 4 - "_select_palette_for_mode"
Cohesion: 0.18
Nodes (4): _palette_is_dark(), _relative_luminance(), TestEndToEndCoherence, TestLuminance

### Community 5 - "search"
Cohesion: 0.06
Nodes (10): _normalize_rtl_level(), _rtl_row_filter(), search(), _style_search_destination(), TestSearchDomains, TestImeGuidance, read_rows(), RtlDataContractTest (+2 more)

### Community 6 - "search_stack"
Cohesion: 0.08
Nodes (8): _exact_stack_identifier(), search_stack(), TestDiagnosticsContracts, _rows(), TestNativeDesktopStackFreshness, TestTextLayoutRetrieval, _rows(), TestWebStackFreshness

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (38): devDependencies, autoprefixer@10.4.20, eslint@8.57.1, eslint-plugin-react@7.37.2, eslint-plugin-react-hooks@5.0.0, postcss@8.4.49, tailwindcss@3.4.15, @types/node@22.10.1 (+30 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx (+13 more)

### Community 10 - "cn"
Cohesion: 0.06
Nodes (49): dependencies, clsx@2.1.1, idb@8.0.0, lucide-react@0.460.0, @radix-ui/react-alert-dialog@1.1.2, @radix-ui/react-dialog@1.1.4, react@18.3.1, react-dom@18.3.1 (+41 more)

### Community 11 - "TestLightResultOutputCoherence"
Cohesion: 0.24
Nodes (3): format_markdown(), _mode_support_labels(), TestLightResultOutputCoherence

### Community 13 - "core.py"
Cohesion: 0.05
Nodes (28): BM25, _contains_phrase(), _domain_keywords(), _exact_match_diagnostic(), _exact_row_identity(), _file_signature(), _get_bm25(), _legacy_successor_guidance() (+20 more)

### Community 15 - "test_skill_script_paths.py"
Cohesion: 0.38
Nodes (3): resolve(), shipped_invocations(), SkillScriptPathsTest

### Community 26 - "_contrast_ratio"
Cohesion: 0.22
Nodes (4): _button_outline_text_color(), _contrast_ratio(), _derive_dark_palette(), format_master_md()

### Community 27 - "test_design_system_mode.py"
Cohesion: 0.21
Nodes (4): _query_wants_dark(), _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

## Knowledge Gaps
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `search()` connect `search` to `validate_data.py`, `DesignSystemGenerator`, `design_system.py`, `search_stack`, `core.py`, `detect_domain`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestReasoningMatch` and `TestReasoningContract`) actually correct?**
  _`DesignSystemGenerator` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `validate_data.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06946386946386947 - nodes in this community are weakly interconnected._
- **Why does `DesignSystemGenerator` connect `DesignSystemGenerator` to `design_system.py`, `_select_palette_for_mode`, `TestLightResultOutputCoherence`, `_contrast_ratio`, `test_design_system_mode.py`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `DesignSystemGenerator` be split into smaller, more focused modules?**
  _Cohesion score 0.053208137715179966 - nodes in this community are weakly interconnected._
- **Why does `search_stack()` connect `search_stack` to `search`, `design_system.py`, `core.py`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `design_system.py` be split into smaller, more focused modules?**
  _Cohesion score 0.060153776571687016 - nodes in this community are weakly interconnected._