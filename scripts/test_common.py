import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import get_frontmatter_from_text  # noqa: E402


def fm(*lines: str, newline: str = '\n') -> dict:
    return get_frontmatter_from_text(newline.join(['---', *lines, '---', '', 'Body.']))


class TestScalars(unittest.TestCase):
    def test_plain_and_quoted_scalars(self):
        out = fm('name: Jorn', 'state: "alive"', 'exists: false')
        self.assertEqual(out['name'], 'Jorn')
        self.assertEqual(out['state'], 'alive')
        self.assertEqual(out['exists'], 'false')

    def test_unquoted_link(self):
        self.assertEqual(fm('location: [[Duskwater]]')['location'], 'Duskwater')

    def test_quoted_link_matches_unquoted(self):
        self.assertEqual(fm('location: "[[Duskwater]]"')['location'], 'Duskwater')
        self.assertEqual(fm("location: '[[Duskwater]]'")['location'], 'Duskwater')

    def test_link_alias_and_note_are_dropped(self):
        for line in ('race: [[Goliath|goliath]]', 'race: "[[Goliath|goliath]]"',
                     'race: [[Goliath]] (stone-born)', 'race: "[[Goliath]] (stone-born)"'):
            with self.subTest(line=line):
                self.assertEqual(fm(line)['race'], 'Goliath')

    def test_dash_note_is_dropped(self):
        self.assertEqual(fm('patron: "[[Father Donavich]] — priest"')['patron'], 'Father Donavich')

    def test_quoted_prose_starting_with_a_link_is_kept_whole(self):
        for value in ("[[Miguel]]'s PC. Odibli Spannerbranch",
                      '[[Highland Seat]] under the Ridge-Council',
                      '[[Aedra]], a dark entity'):
            with self.subTest(value=value):
                self.assertEqual(fm(f'description: "{value}"')['description'], value)

    def test_crlf(self):
        out = fm('name: Jorn', 'location: "[[Duskwater]]"', newline='\r\n')
        self.assertEqual(out['name'], 'Jorn')
        self.assertEqual(out['location'], 'Duskwater')


class TestLists(unittest.TestCase):
    def test_plain_items(self):
        out = fm('tags:', '  - character', '  - "character/npc"')
        self.assertEqual(out['_list_tags'], ['character', 'character/npc'])

    def test_quoted_and_unquoted_links_match(self):
        out = fm('relates_to:',
                 '  - [[Harrow Bane]] (his captain)',
                 '  - "[[House Marlow]] (the band\'s unofficial employer)"',
                 "  - '[[Ashford]]'",
                 '  - "[[Mara Tull|the sheriff]]"')
        self.assertEqual(out['_list_relates_to'], ['Harrow Bane', 'House Marlow', 'Ashford', 'Mara Tull'])

    def test_quoted_prose_item_is_kept_whole(self):
        out = fm('open_threads:', '  - "[[Halsby]]\'s reason to be in Ashford is settled"')
        self.assertEqual(out['_list_open_threads'], ["[[Halsby]]'s reason to be in Ashford is settled"])

    def test_items_attach_to_the_latest_key(self):
        out = fm('tags:', '  - deity', 'worshippers:', '  - "[[The Pale Order]]"')
        self.assertEqual(out['_list_tags'], ['deity'])
        self.assertEqual(out['_list_worshippers'], ['The Pale Order'])


class TestBlock(unittest.TestCase):
    def test_no_frontmatter(self):
        self.assertEqual(get_frontmatter_from_text('# Just a heading\n'), {})

    def test_comment_lines_are_skipped(self):
        out = fm('# --- MANDATORY ---', 'name: Jorn', '# --- HISTORIAN ---', 'played_date: "2026-03-09"')
        self.assertEqual(out['name'], 'Jorn')
        self.assertEqual(out['played_date'], '2026-03-09')


if __name__ == '__main__':
    unittest.main()
