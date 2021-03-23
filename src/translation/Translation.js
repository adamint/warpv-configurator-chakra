import { ConfigurationParameters } from './ConfigurationParameters';

export const BEGIN_PROGRAM_LINE = "/* BEGIN PROGRAM"
export const END_PROGRAM_LINE = "END_PROGRAM */"

export function translateParametersToJson(generalSettings, pipelineSettings) {
  if (generalSettings.isa !== 'RISC-V') delete generalSettings['isaExtensions'];
}

export function translateJsonToM4Macros(json) {
  const {general, pipeline} = json;
  const lines = [];
  lines.push(`m4_define(['M4_ISA'], ['${general.isa}'])`);
  lines.push(`m4_define(['M4_STANDARD_CONFIG'], ['${general.depth}-stage'])`);
  general.isaExtensions?.forEach(extension => lines.push(`m4_define(['M4_EXT_${extension}'], 1)`));
  Object.entries(pipeline).forEach(entry => {
    const [jsonKey, value] = entry;
    const foundParameter = ConfigurationParameters.find(p => p.jsonKey === jsonKey);
    if (!foundParameter) throw Error(`Parameter ${jsonKey} not found`);
    if (foundParameter.validator && !foundParameter.validator(value, foundParameter)) throw Error(`Parameter ${jsonKey} failed validation`);
    lines.push(`${foundParameter.macroType}(['${foundParameter.verilogName}'], ${tlvM4OutputMapper(value, foundParameter.type)})`);
  });
  return lines;
}

function tlvM4OutputMapper(input, type) {
  if (typeof input === 'boolean') return input ? `1'b1` : `1'b0`;
  else if (typeof input === 'number') return input;
  else if (typeof input === 'string') return `"${input}"`;
}

export function getTLVCodeForDefinitions(definitions, includeLib) {
  return `\\m4_TLV_version 1d: tl-x.org
\\SV
    ${includeLib ? `m4_include_lib(['${includeLib}'])` : ""}
// TODO: This is likely to change in revisions of WARP-V, and there's no automation to check it.
m4+definitions(['
        m4_define_vector(['M4_WORD'], 32)
        m4_define(['M4_NUM_INSTRS'], 0)   // TODO: Delete when using next rev of risc-v_defs.tlv.
        ${includeLib ? "m4_echo(m4tlv_riscv_gen__body())" : ""}
        ${definitions ? definitions.join("\n") : ""}
'])
// =============
// Assembly Code
// =============
// The syntax below will be parsed to find the program.
${BEGIN_PROGRAM_LINE}
m4_instr0['']m4_forloop(['m4_instr_ind'], 1, M4_NUM_INSTRS, ['m4_new_line()m4_echo(['m4_instr']m4_instr_ind)'])
${END_PROGRAM_LINE}
            `;
}