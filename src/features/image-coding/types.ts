export type CodingScope = {
  studentName: string;
  sessionSeqnum: number;
};

export type CodingStudent = {
  name: string;
};

export type CodingSession = {
  seqnum: number;
  stage: string;
};

export type CodingImage = {
  /**
   * Backend identifier from the feedback's classifier data. Image coding
   * sends these ids instead of screenshot names.
   */
  classifierDataId: number;
  /**
   * File name extracted from the feedback screenshot path. This is what the
   * blob endpoint expects and what selection/codes are keyed by.
   */
  name: string;
};

/**
 * A code is a free-form piece of text that can be attached to many images.
 * Images can, in turn, belong to many codes.
 */
export type ImageCode = {
  id: string;
  text: string;
  color: string;
  imageNames: string[];
  createdAt: string;
  updatedAt: string;
};
