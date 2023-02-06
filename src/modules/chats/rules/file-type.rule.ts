import { FileValidator } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export type FileTypeValidatorOptions = {
  fileType: string | RegExp;
};

export class FileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
  buildErrorMessage() {
    const i18n = I18nContext.current();
    return i18n.t('validation.FileType', {
      args: {
        type: this.validationOptions.fileType,
      },
    });
  }

  isValid(file) {
    if (!this.validationOptions) {
      return true;
    }
    if (!file.mimetype) {
      return false;
    }
    return Boolean(file.mimetype.match(this.validationOptions.fileType));
  }
}
