import MoveFootnotesToTheBottom from '../rules/move-footnotes-to-the-bottom';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: MoveFootnotesToTheBottom,
  testCases: [
    {
      testName: 'Simple case',
      before: dedent`
        This has a footnote reference at the end [^alpha]
        [^alpha]: bravo and charlie.
        ${''}
        Line
      `,
      after: dedent`
        This has a footnote reference at the end [^alpha]
        Line
        ${''}
        [^alpha]: bravo and charlie.
      `,
    },
    {
      testName: 'Multiline footnotes',
      before: dedent`
        lora ipsala [^note] dolores.
        ${''}
        [^note]: This is not right
        ${''}
            - because the footnote takes more than one paragraph.
            - and linter does only move the first line.
        ${''}
            but not the rest of it
        ${''}
            it will mess up every multiline note instantly
        ${''}
        this is not cool
      `,
      after: dedent`
        lora ipsala [^note] dolores.
        ${''}
        this is not cool
        ${''}
        [^note]: This is not right
        ${''}
            - because the footnote takes more than one paragraph.
            - and linter does only move the first line.
        ${''}
            but not the rest of it
        ${''}
            it will mess up every multiline note instantly
      `,
    },
    {
      testName: 'Long Document with multiple consecutive footnotes',
      before: dedent`
        # Part 1
        Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^1] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^2] . In pri reque accumsan, quidam noster interpretaris in est.[^3] Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^4] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^5]
        ${''}
        [^1]: See @JIPPChristKingPaul2015, 50.
        [^2]: Jipp in -@JIPPChristKingPaul2015, 45, says, “Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has”.
        [^3]: This is from Journal article --@gaventaLouisMartynGalatians2000, 99.
        [^4]: Lorem ipsum dolor sit amet, cibo eripuit consulatu at vim. No quando animal eam, ea timeam ancillae incorrupte usu. Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in es. See @WANRomansIntroductionStudy2021, 45.
        [^5]: See @johnsonTransformationMindMoral2003, 215.
        ${''}
        No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^a]
        ${''}
        Eu graeco blandit instructior pro, ut vidisse mediocrem qui. Ex ferri melius evertitur qui. At nec eripuit legimus.[^b] Ut meis solum recusabo eos, usu in[^c] assueverit eloquentiam, has facilis scribentur ea. No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^d]
        ${''}
        [^a]: Footnote 1.
        [^b]: Footnote 2.
        [^c]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
        [^d]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
        ${''}
        # Part 3
        In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Mel et vocent scribentur.[^11]
        ${''}
        > In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Te sea stet deserunt, vel tritani eligendi platonem ut, sea ea fugit iriure. Usu at elaboraret scriptorem signiferumque, cetero reprimique est cu. Ei eos deleniti electram. Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^21]
        ${''}
        Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^31]
        ${''}
        Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^41]
        ${''}
        [^11]: See @JIPPMessianicTheologyNew2020
        [^21]: See @jippDivineVisitationsHospitality2013. Dunn in @dunnRomans181988, says, “Mel et vocent scribentur.”
        [^31]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
        [^41]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
      `,
      after: dedent`
        # Part 1
        Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^1] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^2] . In pri reque accumsan, quidam noster interpretaris in est.[^3] Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in est.[^4] Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has.[^5]
        ${''}
        No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^a]
        ${''}
        Eu graeco blandit instructior pro, ut vidisse mediocrem qui. Ex ferri melius evertitur qui. At nec eripuit legimus.[^b] Ut meis solum recusabo eos, usu in[^c] assueverit eloquentiam, has facilis scribentur ea. No hendrerit efficiendi eam. Vim ne ferri populo voluptatum, et usu laboramus scribentur, per illud inermis consetetur id.[^d]
        ${''}
        # Part 3
        In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Mel et vocent scribentur.[^11]
        ${''}
        > In has assum falli habemus, timeam apeirian forensibus nam no, mutat facer antiopam in pri. Te sea stet deserunt, vel tritani eligendi platonem ut, sea ea fugit iriure. Usu at elaboraret scriptorem signiferumque, cetero reprimique est cu. Ei eos deleniti electram. Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^21]
        ${''}
        Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^31]
        ${''}
        Prima prompta partiendo ius ne. Modo omnes neglegentur cu vel, nisl illum vel ex. Mel et vocent scribentur.[^41]
        ${''}
        [^1]: See @JIPPChristKingPaul2015, 50.
        [^2]: Jipp in -@JIPPChristKingPaul2015, 45, says, “Sale populo petentium vel eu, eam in alii novum voluptatum, te lorem postulant has”.
        [^3]: This is from Journal article --@gaventaLouisMartynGalatians2000, 99.
        [^4]: Lorem ipsum dolor sit amet, cibo eripuit consulatu at vim. No quando animal eam, ea timeam ancillae incorrupte usu. Graece insolens eloquentiam te mea, te novum possit eam. In pri reque accumsan, quidam noster interpretaris in es. See @WANRomansIntroductionStudy2021, 45.
        [^5]: See @johnsonTransformationMindMoral2003, 215.
        [^a]: Footnote 1.
        [^b]: Footnote 2.
        [^c]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
        [^d]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
        [^11]: See @JIPPMessianicTheologyNew2020
        [^21]: See @jippDivineVisitationsHospitality2013. Dunn in @dunnRomans181988, says, “Mel et vocent scribentur.”
        [^31]: Abraham in -@abrahamPostcolonialTheologies2015, says, “Ei eos deleniti electram. Prima prompta partiendo ius ne.”
        [^41]: Wright in -@wrightPaulFreshPerspective2005 says, “Modo omnes neglegentur cu vel.”
      `,
    },
    {
      testName: 'Footnote already at the bottom does not add an extra newline',
      before: dedent`
        Line [^alpha]
        ${''}
        [^alpha]: bravo and charlie.
      `,
      after: dedent`
        Line [^alpha]
        ${''}
        [^alpha]: bravo and charlie.
      `,
    },
    {
      testName: 'Make sure that a footnote placed between footnotes that already have content at the end of the file properly gets properly ordered',
      before: dedent`
        reference A [^1]
        ${''}
        reference C [^2]
        [^2]: footnote C (inserted between A and B)
        ${''}
        reference B [^2]
        ${''}
        [^1]: footnote A (first in document)
        [^2]: footnote B (last in document)
      `,
      after: dedent`
        reference A [^1]
        ${''}
        reference C [^2]
        reference B [^2]
        ${''}
        [^1]: footnote A (first in document)
        [^2]: footnote C (inserted between A and B)
        [^2]: footnote B (last in document)
      `,
    },
  ],
});

